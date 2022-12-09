{
	"info": {
		"_postman_id": "2b3b6a28-8e7d-48e0-88fb-81ede2544140",
		"name": "Watson Assistant Example",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "1490545"
	},
	"item": [
		{
			"name": "Get  Watson Assistant Session",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:3010/getsession",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3010",
					"path": [
						"getsession"
					]
				}
			},
			"response": []
		},
		{
			"name": "Send message to Watson Assistant",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{ \"sendmessage\" : {\"sessionID\" : \"87bb1085-c96e-4296-b78f-172273485326\",\n\"message_type\": \"text\",\n\"text\": \"What is a CVV\"\n}\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3010/sendmessage",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3010",
					"path": [
						"sendmessage"
					]
				}
			},
			"response": []
		}
	]
}