from neo4j import GraphDatabase# Function to create entities and connections
import re

class graph_uploader():

    def __init__(self,uri,username,password):
        self.uri = uri
        self.username = username
        self.password = password


    def create_entities_and_connections(tx, source, relationship, target, source_type, target_type):
        query = (
            f"MERGE (s:{source_type} {{name: $source}}) " +
            f"MERGE (t:{target_type} {{name: $target}}) " +
            f"MERGE (s)-[r:CONNECTED_TO {{relationship: $relationship}}]->(t)"
        )
        print(query)
        tx.run(query, source=source, relationship=relationship, target=target)
    def create_node(tx, name, type):
        query = f"MERGE (p:{type} {{name: $name}})"
        print(query)
        tx.run(query, name=name)# Connect to your Neo4j database

    def upload_graph(self,site,iteration):
        with GraphDatabase.driver(self.uri, auth=(self.username, self.password)) as driver:
            # Open and read the file with triplets
            with open("outputs/GPT-output3 copy.txt", mode="r") as file:
                reader = file.readlines()
                for line in reader:
                        line = line.strip("()\n")
                        try:
                            source, relationship, target = line.split(",")
                            source_type = re.search(r'\{.*?\}',source).group().replace('{','').replace('}','')
                            target_type = re.search(r'\{.*?\}',target).group().replace('{','').replace('}','')
                            source_entity = re.search(r'\[.*?\]',source).group().replace('[','').replace(']','')
                            target_entity = re.search(r'\[.*?\]',target).group().replace('[','').replace(']','')
                            print("source: "+str(source_entity)+" source type: "+str(source_type)+" relationship: "+str(relationship)+" target: "+str(target_entity)+" target type: "+str(target_type))             
                            with driver.session() as session:
                                session.write_transaction(graph_uploader.create_entities_and_connections, source_entity, relationship, target_entity, source_type, target_type)
                        except ValueError as e:
                            print(e)
                            continue