using UnityEngine;
using System.Collections;
using GameSparks.Api.Messages;
using GameSparks.Core;

public class GameSparksManager : MonoBehaviour 
{
	/// <summary>The GameSparks Manager singleton</summary>
	private static GameSparksManager instance = null;
	public MatchFoundMessage._Participant opponent;
	public string matchId;
	public string uname;
	public string playerId;
	public string color;

	void Awake()
	{
		if (instance == null) // check to see if the instance has a refrence
		{
			instance = this; // if not, give it a refrence to this class...
			DontDestroyOnLoad(this.gameObject); // and make this object persistant as we load new scenes
		} 
		else // if we already have a refrence then remove the extra manager from the scene
		{
			Destroy(this.gameObject);
		}
	}
}
