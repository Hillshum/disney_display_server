"""
This script parses the raw_characters.txt file and creates a json file
with the mappings of the confusable characters to the ascii characters
"""
import json

file_path = "raw_characters.txt"

mappings = {}

with open(file_path, "r") as file:
    for codes in file:
        # Process each line here
        if codes.startswith('#'):
            continue
        # codes = line.split(',')
        ascii_code = codes[0]
        for code in codes.rstrip('\n')[1:]:
            if code == '\n':
                print("newline")
            mappings[code] = ascii_code


# write the mappings to json
with open('src/confusables.json', 'w') as outfile:
    json.dump(mappings, outfile)