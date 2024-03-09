import os
from dotenv import load_dotenv
import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

# Fonction pour charger la clé publique
# def load_public_key(file_path):
#     with open(file_path, "rb") as key_file:
#         public_key = serialization.load_pem_public_key(
#             key_file.read(),
#             backend=default_backend()
#         )
#     return public_key

# # Fonction pour charger la clé privée
# def load_private_key(file_path):
#     with open(file_path, "rb") as key_file:
#         private_key = serialization.load_pem_private_key(
#             key_file.read(),
#             password=None,  # Remplacez None par le mot de passe si votre clé est chiffrée
#             backend=default_backend()
#         )
#     return private_key

with open("private_key.pem", "rb") as key_file:
    private_key = serialization.load_pem_private_key(
        key_file.read(),
        password=None,
        backend=default_backend()
    )

with open("public_key.pem", "rb") as key_file:
    public_key = serialization.load_pem_public_key(
        key_file.read(),
        backend=default_backend()
    )

pem_public_key = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)
# # Utilisation de la fonction
# private_key_path = 'private_key.pem'
# private_key = load_private_key(private_key_path)


# # Utilisation de la fonction
# public_key_path = 'public_key.pem'
# public_key = load_public_key(public_key_path)

# Pour convertir la clé publique en une chaîne qui peut être utilisée dans une requête HTTP
# public_key_str = public_key.public_bytes(
#     encoding=serialization.Encoding.PEM,
#     format=serialization.PublicFormat.SubjectPublicKeyInfo
# ).decode('utf-8')

# Charger les variables d'environnement
load_dotenv()
API_SECRET = os.getenv('API_SECRET')
AUTH_ID = os.getenv('AUTH_ID')
AUTH_SECRET = os.getenv('AUTH_SECRET')

# Vous pourriez avoir besoin de générer ou charger une clé publique ici
# Cela dépend de votre méthode de gestion des clés publiques/privées

# Fonction pour créer une Installation
def create_installation(public_key):
    url = "https://api.bunq.com/v1/installation"
    headers = {"Content-Type": "application/json"}
    data = {"client_public_key": public_key}
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Fonction pour créer un DeviceServer
def create_device_server(api_token, description, secret):
    url = "https://api.bunq.com/v1/device-server"
    headers = {
        "Content-Type": "application/json",
        "X-Bunq-Client-Authentication": api_token,
    }
    data = {
        "description": description,
        "secret": secret,
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Fonction pour créer un SessionServer
def create_session_server(api_token):
    url = "https://api.bunq.com/v1/session-server"
    headers = {
        "Content-Type": "application/json",
        "X-Bunq-Client-Authentication": api_token,
    }
    response = requests.post(url, headers=headers)
    return response.json()


def exchange_authorization_code_for_access_token(code, client_id, client_secret, redirect_uri):
    token_url = "https://api.oauth.bunq.com/v1/token"
    params = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret
    }
    response = requests.post(token_url, params=params)
    return response.json()

# Exemple d'utilisation des fonctions
# Remplacez `votre_clé_publique`, `votre_description`, et `votre_secret`
# par vos informations réelles avant d'exécuter

# public_key = "votre_clé_publique"
# installation_response = create_installation(public_key)
# print(installation_response)

# api_token = installation_response['Response'][1]['Token']['token']
# device_server_response = create_device_server(api_token, "MaDescription", API_SECRET)
# print(device_server_response)

# session_server_response = create_session_server(api_token)
# print(session_server_response)


# URL de l'API bunq pour l'authentification
auth_url = "https://public-api.sandbox.bunq.com/v1/session-server"

# En-têtes de la requête
headers = {
    'X-Bunq-Client-Authentication': API_SECRET,
    'Content-Type': 'application/json'
}

# Corps de la requête (vous devrez remplacer les valeurs par les vôtres)
data = {
    "secret": API_SECRET
}

# Effectuer la requête d'authentification
response = requests.post(auth_url, json=data, headers=headers)

if response.status_code == 200:
    print("Authentification réussie")
    # Extraire le token d'authentification depuis la réponse
    auth_token = response.json()['Response'][1]['Token']['token']
    print("Token d'authentification:", auth_token)
else:
    print("Échec de l'authentification")

# Ici, vous pouvez continuer à utiliser `auth_token` pour effectuer d'autres requêtes à l'API
# 