from openai import openai
from EIQscraper import EIQscraper
from graph_uploader import graph_uploader
from dotenv import load_dotenv
import os
import re
ARTICLES_TO_PROCESS = 5

load_dotenv()
openai.api_key="ABC"  
openai.api_base="http://127.0.0.1:8081"
filename = "./outputs/"
os.makedirs(os.path.dirname(filename), exist_ok=True)

regex = r"\('\[(.*?)\]\{(\bACTOR\b|\bVULNERABILITY\b|\bFILE\b|\bMALWARE\b|\bHOST\b|\bPROCESS\b|\bREGISTRY\b)\}',\s*'(.*?)',\s*'\[(.*?)\]\{(\bACTOR\b|\bVULNERABILITY\b|\bFILE\b|\bMALWARE\b|\bHOST\b|\bPROCESS\b|\bREGISTRY\b)\}'\)"

scraper_list = [EIQscraper]
for site in scraper_list:
    try:
        print("Beginning scraping for "+str(len(scraper_list))+" sites")
        site.scrape(ARTICLES_TO_PROCESS)
        print("Scraping Complete")
    except:
        print("Error encountered in scraping process. Exiting.")
        exit()

    print("Entering GPT pipeline")
    for i in range (0,ARTICLES_TO_PROCESS):#10):
        data = ""
        with open('./posts/'+site.blog_name+'post'+str(i)+'.txt','r') as f:
            data = f.read()
            f.close()

        print("Beginning pipeline for post"+str(i)+".")

        try:
            chat_completion1 = openai.ChatCompletions.create(
                prompt = "Please generate a refined document of the following document. Please ensure that the refined document meets the following criteria: 1. The refined document should be abstract and does not change any original meaning of the document. 2. The refined document should retain all the important objects, concepts, and relationships between them. 3. The refined document should only contain information that is from the document. 4. The refined document should be readable and easy to understand without any abbreviations and misspellings. Here is the document:"+data,
                model="Llama2",
            )
            refinedText = str(chat_completion1.choices[0].message.content)

            with open('./posts/'+site.blog_name+'post'+str(i)+'refined.txt','w') as f:
                f.write(refinedText)
                f.close()

            print("Prompt 1 returned successfully.")
            chat_completion2 = openai.ChatCompletions.create(
                    prompt= "You are a named entity recognition model. Your goal is to find and label 7 types of named entities. Mark the named entities in the text itself with square brackets. Also specify which type of entity it is in paranthesis. Here are the 7 types: 1. ACTOR - an ACTOR is an individual or group with malicious intent. Refrain from labeling entities that are not implied to be malicious. A country is not always an ACTOR. Do not tag the single word \"actor\" as an ACTOR without additional context implying it is malicious. 2. FILE - a FILE is specific file or reference to a particular file extension 3. HOST - a HOST is an actor controlled digital object that can be accessed remotely-  4. VULNERABILITY - a VULNERABILITY is a specific vector of attack. Tag any CVE ID as a VULNERABILITY. 5. MALWARE - a MALWARE is a named malicious process used to execute an attack or exploit a vulnerability. Multiple MALWARE may be found listed in the text. Include the name of the MALWARE. - 6. PROCESS - a PROCESS is an application, tool, or protocol that can be used as an attack vector or be used on behalf of an ACTOR or MALWARE to advance an attack or exploit a VULNERABILITY. a PROCESS is not necessarily a malware. Multiple PROCESS may be found listed in the text 7. REGISTRY - a REGISTRY is a direct filepath or other reference to a specific heirarchical database or memory structure 8. IP - an IP of a remote seerver - Note: Be sure to tag reoccurrences of entities that have been previously identified with the same tag. Do not add any tags that are not listed here. Input:"+refinedText,
                    model="Llama2",
                )

            refinedAndLabeled = str(chat_completion2.choices[0].message.content)

            with open('./posts/'+site.blog_name+'post'+str(i)+'labeled.txt','w') as f:
                f.write(refinedAndLabeled)
                f.close()

            print("Prompt 2 returned successfully.")
            chat_completion3 = openai.ChatCompletions.create(
                prompt= "You are a knowledge graph extractor, and your task is to extract and return a knowledge graph from a given text. Follow these steps: (1). Identify the entities in the text. The entities in the text are explicitly marked inside square brackets followed by curly brackets containing a type eg. [entity]{type}. DO NOT mark any addition entities. Only use what is already marked. (2). Identify the relationship between the marked entities. A relationship can be a verb or a prepositional phrase that connects two entities. You can use dependency parsing to identify the relationships. Only identify relationships between the marked entities. (3). Summarize each relation as short as possible and remove any stop words. (4). Only return the knowledge graph in the triplet format: ('[head entity]{type}','relation','[tail entity]{type}'). Include the square brackets in the entity names. Also include the type in curly brackets eg. ('[Villain Group]{ACTOR}','uploaded malicious document','[MeetingReview.docx]{FILE}') Only include one head entity and one tail entity per entry. Make sure the head and tail entities follow the [entity]{type} format. Do not include triplets that contain entities that are not already marked in the input. (5). Most importantly, if you cannot find any knowledge, please just output: \"None\". Output the triplets extracted in the following format: one triplet followed by a newline character. Here is the content:"+refinedAndLabeled,
                model="Llama2",
                )
            with open("./outputs/Llama2-"+site.blog_name+"output"+str(i)+"raw.txt","w") as f:
                f.write(str(chat_completion3.choices[0].message.content))
                f.close()
                print("Pipeline successful for post"+str(i)+". Beginning graph upload.")
        except Exception as e:
            print(e)
            print("Error encountered in pipeline for post"+str(i)+". Aborting pipeline for post "+str(i)+".")
            continue
        
        with open("./outputs/Llama2-"+site.blog_name+"output"+str(i)+"raw.txt","r") as r:
            with open("./outputs/Llama2-"+site.blog_name+"output"+str(i)+".txt","w") as f:
                lines = r.readlines()
                #print(lines)
                for line in lines:
                    if(re.search(regex,line.strip()) or re.search(regex,line)):
                        f.write(line)
                f.close()
            r.close()

        try:
            uploader = graph_uploader(str(os.getenv("N4J_INSTANCE_ADDR")),os.getenv("N4J_USER"),os.getenv("N4J_PASSWORD")) # set N4J_INSTANCE_ADDR to localhost
            uploader.upload_graph(site,i)
            print("Knowledge graph for post"+str(i)+" uploaded successfully.")
        except Exception as e:
            print(e)
            print("Error encountered in graph upload for post"+str(i)+". Exiting.")
            continue
        
