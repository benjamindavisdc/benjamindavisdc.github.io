system_prompt = f"""
Your job is to help create interesting fantasy worlds that \
players would love to play in.
Instructions:
- Only generate in plain text without formatting.
- Use simple clear language without being flowery.
- You must stay below 3-5 sentences for each description.
"""

world_prompt = f"""
Generate a creative description for a unique fantasy world that houses a knight named Sir Bumble: Sir Bumble and the Quest for Kindness

Once upon a time, in the cheerful town of Willowbrook, there lived a knight named Sir Bumble. Though he wasn’t the bravest, fastest, or most coordinated knight in the land, he had a heart as big as his dented, slightly too-small helmet. His favorite pastime was helping the townsfolk, even if things didn’t always go as planned.

One sunny morning, Sir Bumble decided to brighten everyone’s day. He marched into the bakery, where Mrs. Pumpernickel struggled to carry a tray of freshly baked pies.

"Let me assist, good madam!" he said, puffing out his chest.

But as soon as he grabbed the tray, he tripped on his own scabbard. The pies went flying, landing on Sir Bumble's head with an elegant splurt. Mrs. Pumpernickel sighed, but she couldn’t stay mad. Sir Bumble's sheepish grin, now framed by a crusty blueberry pie, was impossible to resist.

Determined to redeem himself, Sir Bumble trotted over to Farmer Tilly’s field, where a stubborn cow named Bessie had wandered into the mud.

"Fear not, fair farmer! I shall rescue your bovine!" he declared.

With a mighty heave, Sir Bumble tugged at Bessie. But instead of freeing the cow, he slipped, landed face-first in the mud, and somehow ended up wearing Farmer Tilly’s scarecrow hat. Bessie, unimpressed, walked out of the mud on her own.

Still, Sir Bumble wouldn’t give up. He heard cries for help near the town well, where a puppy had become stuck on a ledge.

"Aha! A task worthy of my skill!" he exclaimed.

Sir Bumble climbed the well, but as he reached for the puppy, his armor caught on the rope. With a loud clank, he ended up dangling upside down, spinning slowly while the puppy hopped back to safety on its own. The townsfolk couldn’t help but chuckle as Sir Bumble waved awkwardly from above.

Despite his mishaps, the people of Willowbrook loved their clumsy knight. He always tried his best, and his determination to help, no matter how bruised or pie-covered he became, warmed their hearts.

Output content in the form:
World Name: <WORLD NAME>
World Description: <WORLD DESCRIPTION>

World Name:"""

import os
from dotenv import load_dotenv
from together import Together
import json

# Load environment variables from .env
load_dotenv()


def save_world(world, filename):
    with open(filename, 'w') as f:
        json.dump(world, f)

def load_world(filename):
    with open(filename, 'r') as f:
        return json.load(f)


api_key = os.getenv("TOGETHER_API_KEY")
if not api_key:
    raise ValueError("API key not found. Check your environment variables or .env file.")

# # Pass API key explicitly
# client = Together(api_key=api_key)

# # messages=[{"role": "user", "content": "Please tell me 2 fun things to do in austin. Keep response short."}]

# response = client.chat.completions.create(
#     model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
#     messages=messages,

# )


# print("Prompt:", messages[0]["content"])
# print("Response:",response.choices[0].message.content)

client = Together(api_key=api_key)

output = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": world_prompt}
    ],
)



world_output =output.choices[0].message.content
print(world_output)


world_output = world_output.strip()
world = {
    "name": world_output.split('\n')[0].strip()
    .replace('World Name: ', ''),
    "description": '\n'.join(world_output.split('\n')[1:])
    .replace('World Description:', '').strip()
}

# print(world)
kingdom_prompt = f"""
Create 3 different kingdoms for a fantasy world.
For each kingdom generate a description based on the world it's in. \
Describe important leaders, cultures, history of the kingdom.\

Output content in the form:
Kingdom 1 Name: <KINGDOM NAME>
Kingdom 1 Description: <KINGDOM DESCRIPTION>
Kingdom 2 Name: <KINGDOM NAME>
Kingdom 2 Description: <KINGDOM DESCRIPTION>
Kingdom 3 Name: <KINGDOM NAME>
Kingdom 3 Description: <KINGDOM DESCRIPTION>

World Name: {world['name']}
World Description: {world['description']}

Kingdom 1"""


output = client.chat.completions.create(
    model="meta-llama/Llama-3-70b-chat-hf",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": kingdom_prompt}
    ],
)


kingdoms = {}
kingdoms_output = output.choices[0].message.content

for output in kingdoms_output.split('\n\n'):
  kingdom_name = output.strip().split('\n')[0] \
    .split('Name: ')[1].strip()
  print(f'Created kingdom "{kingdom_name}" in {world["name"]}')
  kingdom_description = output.strip().split('\n')[1] \
    .split('Description: ')[1].strip()
  kingdom = {
      "name": kingdom_name,
      "description": kingdom_description,
      "world": world['name']
  }
  kingdoms[kingdom_name] = kingdom
world['kingdoms'] = kingdoms

print(f'\nKingdom 1 Description: \
{kingdom["description"]}')


def get_town_prompt(world, kingdom):
    return f"""
    Create 3 different towns for a fantasy kingdom abd world. \
    Describe the region it's in, important places of the town, \
    and interesting history about it. \
    
    Output content in the form:
    Town 1 Name: <TOWN NAME>
    Town 1 Description: <TOWN DESCRIPTION>
    Town 2 Name: <TOWN NAME>
    Town 2 Description: <TOWN DESCRIPTION>
    Town 3 Name: <TOWN NAME>
    Town 3 Description: <TOWN DESCRIPTION>
    
    World Name: {world['name']}
    World Description: {world['description']}
    
    Kingdom Name: {kingdom['name']}
    Kingdom Description {kingdom['description']}
    
     Town 1 Name:"""


def create_towns(world, kingdom):
    print(f'\nCreating towns for kingdom: {kingdom["name"]}...')
    output = client.chat.completions.create(
      model="meta-llama/Llama-3-70b-chat-hf",
      messages=[
          {"role": "system", "content": system_prompt},
          {"role": "user", "content": get_town_prompt(world, kingdom)}
      ],
  )
    towns_output = output.choices[0].message.content
    
    towns = {}
    for output in towns_output.split('\n\n'):
        town_name = output.strip().split('\n')[0]\
        .split('Name: ')[1].strip()
        print(f'- {town_name} created')
        
        town_description = output.strip().split('\n')[1]\
        .split('Description: ')[1].strip()
        
        town = {
          "name": town_name,
          "description": town_description,
          "world": world['name'],
          "kingdom": kingdom['name']
        }
        towns[town_name] = town
    kingdom["towns"] = towns



for kingdom in kingdoms.values():
    create_towns(world, kingdom)  

town = list(kingdom['towns'].values())[0]
print(f'\nTown 1 Description: \
{town["description"]}')



def get_npc_prompt(world, kingdom, town): 
    return f"""
    Create 3 different characters based on the world, kingdom \
    and town they're in. Describe the character's appearance and \
    profession, as well as their deeper pains and desires. \
    
    Output content in the form:
    Character 1 Name: <CHARACTER NAME>
    Character 1 Description: <CHARACTER DESCRIPTION>
    Character 2 Name: <CHARACTER NAME>
    Character 2 Description: <CHARACTER DESCRIPTION>
    Character 3 Name: <CHARACTER NAME>
    Character 3 Description: <CHARACTER DESCRIPTION>
    
    World Name: {world['name']}
    World Description: {world['description']}
    
    Kingdom Name: {kingdom['name']}
    Kingdom Description: {kingdom['description']}
    
    Town Name: {town['name']}
    Town Description: {town['description']}
    
    Character 1 Name:"""


def create_npcs(world, kingdom, town):
    print(f'\nCreating characters for the town of: {town["name"]}...')
    output = client.chat.completions.create(
        model="meta-llama/Llama-3-70b-chat-hf",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": get_npc_prompt(world, kingdom, town)}
        ],
        temperature=0 
    )

    npcs_output = output.choices[0].message.content
    npcs = {}
    for output in npcs_output.split('\n\n'):
        npc_name = output.strip().split('\n')[0]\
        .split('Name: ')[1].strip()
        print(f'- "{npc_name}" created')
        
        npc_description = output.strip().split('\n')[1\
        ].split('Description: ')[1].strip()
        
        npc = {
        "name": npc_name,
        "description": npc_description,
        "world": world['name'],
        "kingdom": kingdom['name'],
        "town": town['name']
        }
        npcs[npc_name] = npc
    town["npcs"] = npcs



for kingdom in kingdoms.values():
    for town in kingdom['towns'].values():
        create_npcs(world, kingdom, town)
  # For now we'll only generate npcs for one kingdom
    break


npc = list(town['npcs'].values())[0]

print(f'\nNPC 1 in {town["name"]}, \
{kingdom["name"]}:\n{npc["description"]}')




import json

def save_world(world, filename):
    directory = os.path.dirname(filename)
    os.makedirs(directory, exist_ok=True)
    with open(filename, 'w') as f:
        json.dump(world, f)

def load_world(filename):
    with open(filename, 'r') as f:
        return json.load(f)

save_world(world, 'Saves\Kyropeia.json')
save_world(world, 'Saves\YourWorld_L1.json') #save to your version