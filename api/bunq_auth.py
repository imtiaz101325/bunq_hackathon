import requests
import json

# Remplacer par le chemin vers votre clé publique générée
with open("public_key.pem", "r") as file:
    public_key = file.read()

headers = {"Content-Type": "application/json"}
data = {
    "client_public_key": public_key
}

response = requests.post("https://api.bunq.com/v1/installation", headers=headers, data=json.dumps(data))
installation_token = response.json()["Response"][1]["Token"]["token"]

description = "Mon application Python"
secret = "VotreCléApiBunq"

data = {
    "description": description,
    "secret": secret,
    # Si vous utilisez une clé API Wildcard, ajoutez votre IP et "*" ici
}

headers["X-Bunq-Client-Authentication"] = installation_token

response = requests.post("https://api.bunq.com/v1/device-server", headers=headers, data=json.dumps(data))


response = requests.post("https://api.bunq.com/v1/session-server", headers=headers, data=json.dumps({}))
session_token = response.json()["Response"][1]["Token"]["token"]
