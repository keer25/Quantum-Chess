using UnityEngine;
using System.Collections;
using GameSparks.Api;
using GameSparks.Api.Requests;
using GameSparks.Api.Responses;
using GameSparks.Api.Messages;
using GameSparks.Core;
using UnityEngine.UI;
using  UnityEngine.SceneManagement;

public class MatchCreate : MonoBehaviour {

	public Text txt;
	public Button btn;
	Button button;
	// Use this for initialization
	void Start () {

		/*
		new AuthenticationRequest()
    	.SetPassword("foobar")
    	.SetUserName("keer25")
    	.Send((response) => {
        	if (!response.HasErrors) {
				Debug.Log("Player Authenticated...");
			} else {
				Debug.Log("Error Authenticating Player...");
			}
    	});
    	*/
    	/*
		new LogEventRequest()
    	.SetEventKey("createMatch")
    	.Send((response) => {
        //GSData scriptData = response.ScriptData; 
    	});
    	*/

    	sendMatchRequest();

    	MatchFoundMessage.Listener = (message) => {
    		//Debug.Log(message.Participants[0].DisplayName);
    		/*
		    string matchId = message.MatchId; 
		    GSEnumerable<var> participants = message.Participants; 
		    int? port = message.Port; 
		    GSEnumerable<GSData> scriptData = message.ScriptData; 
		    string subTitle = message.SubTitle; 
		    string summary = message.Summary; 
		    string title = message.Title; 
		    */
		    GameSparksManager script = GameObject.Find("GameSparksManager").GetComponent<GameSparksManager>();
		    script.matchId = message.MatchId;
		    int count = 0;
			foreach ( var participant in message.Participants){
				if (script.playerId == participant.Id){
					if (count == 0){
						script.color = "black";
					}
					else{
						script.color = "white";
					}
				}
				else{
					script.opponent  = participant;
				}
				count++;
			}
			//Debug.Log(script.color);
		    SceneManager.LoadScene("Main");
		};

		MatchNotFoundMessage.Listener = (message) => {
			txt.text = "Match Not Found :(";
			button = (Button) Instantiate(btn, new Vector3(0,-45,0), Quaternion.identity);
			button.transform.SetParent(GameObject.Find("Canvas").transform, false);
			button.onClick.AddListener(sendMatchRequest);
		};

	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void sendMatchRequest () {
		new MatchmakingRequest()
    		.SetMatchShortCode("main")
    		.SetSkill(0)
    		.Send((response) => { 
	    });
    	txt.text = "Finding a Match....";
    	//GameObject button = GameObject.Find("Canvas/Button");
    	if (button != null){
    		Destroy(button);
    		//button = null;
    		Debug.Log("Button destroy");
    	}	
	}
}
