using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using GameSparks.Api;
using GameSparks.Api.Requests;
using GameSparks.Api.Responses;
using  UnityEngine.SceneManagement;

public class ListenClick : MonoBehaviour {

	public InputField Uname;
	public InputField Pass;
	public Text error;

	// Use this for initialization
	public void onClick () {
		Debug.Log("Button Clicked");
		
		new AuthenticationRequest()
    	.SetPassword("foobar")
    	.SetUserName("keer25")
    	.Send((response) => {
        	if (!response.HasErrors) {
				Debug.Log("Player Authenticated...");
                //script.uname = Uname.text;
                //script.playerId = response.UserId;
                GameSparksManager script = GameObject.Find("GameSparksManager").GetComponent<GameSparksManager>();
                script.uname = "keer25";
                script.playerId = "57729707808eb904a09d14c3";
				SceneManager.LoadScene("MatchFind");
			} else {
				Debug.Log("Error Authenticating Player...");
				error.text = "Please Enter valid details";
			}
    	});
    	/*
    	new FindMatchRequest()
    	.SetAction(null)
    	.SetMatchGroup(null)
    	.SetMatchShortCode("main")
    	.SetSkill(0)
    	.Send((response) => {
        	//GSData scriptData = response.ScriptData; 
        	//Debug.Log(response);
    });
    */
	}

}
