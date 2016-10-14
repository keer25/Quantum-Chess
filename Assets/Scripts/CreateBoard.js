#pragma strict
/*
mode 0 : No piece selected
mode 1 : Classic move selected
mode 2 : Quantum move selected
*/	
import GameSparks.Api.Messages;
import UI;

var btn : Button;
var btn1 : Button;
var white : GameObject;
var black : GameObject;
var pawnWhite : GameObject;
var pawnBlack : GameObject;

private var mode : int;
private var selInd : Array;
private var turn : String;
private var moveCount : int;
// Entangles  = {ind : [{eInd : [[array of samepieces], count, den]},...]}
private var entangles : Hashtable;
private var prevInd : int;
private var prevE : int;
private var prevSquare : SquareController;
private var prevSq : SquareController;

var sameCol : Color;
var entCol : Color;

var chalData : GameSparksManager;

var field : UI.Text;
var pieceField : UI.Text;
var chessBoard : Array;

function Start () {
	turn = "black";
	btn.onClick.AddListener(function(){
		if (turn == "white"){
			turn = "black";
		}
		else{
			turn = "white";
		}
		chalData.color = turn;
		Debug.Log(turn + "'s turn");
	});
	btn1.onClick.AddListener(function(){
		var selSquare : SquareController = getSquare(selInd);
		sendCalc(selSquare.ind[0], selSquare.ind[1],
		 calc(selSquare.hasPieceNum, selSquare.hasPieceDen, selSquare, -1));
	});
	chalData = GameObject.Find("GameSparksManager").GetComponent("GameSparksManager");
	Debug.Log(turn + "'s turn");
	moveCount = 0;
	mode = 0;
	prevInd = -1;
	prevE = -1;
	entangles = new Hashtable();
	field.text = chalData.opponent.DisplayName;
	ScriptMessage.Listener = function(message){
		handleOpponentMove(message);
	};
	chessBoard = [[],[],[],[],[],[],[],[]];
	
	var row : Array= chessBoard[0];
	row.push(GameObject.Find("black").GetComponent(SquareController));
	row.push(GameObject.Find("white").GetComponent(SquareController));
	row.push(GameObject.Find("black (1)").GetComponent(SquareController));
	row.push(GameObject.Find("white (1)").GetComponent(SquareController));
	row.push(GameObject.Find("black (2)").GetComponent(SquareController));
	row.push(GameObject.Find("white (2)").GetComponent(SquareController));
	row.push(GameObject.Find("black (3)").GetComponent(SquareController));
	row.push(GameObject.Find("white (3)").GetComponent(SquareController));
	chessBoard[0] = row;
	row = chessBoard[7];
	row.push(GameObject.Find("white (4)").GetComponent(SquareController));
	row.push(GameObject.Find("black (4)").GetComponent(SquareController));
	row.push(GameObject.Find("white (5)").GetComponent(SquareController));
	row.push(GameObject.Find("black (5)").GetComponent(SquareController));
	row.push(GameObject.Find("white (6)").GetComponent(SquareController));
	row.push(GameObject.Find("black (6)").GetComponent(SquareController));
	row.push(GameObject.Find("white (7)").GetComponent(SquareController));
	row.push(GameObject.Find("black (7)").GetComponent(SquareController));
	chessBoard[7] = row;
	var obj : GameObject;
	var obj1 : GameObject;
	var obj2 : GameObject;
	var comp : SquareController;
	for(var y = -1 ; y<=1 ; y+= 2){
		for (var x=-2; x<=4; x+= 2){
			obj = Instantiate(white, Vector3((x-1)*1.3,(y+1)*1.3,0),Quaternion.identity);
			obj.GetComponent(SquareController).hasPieceNum = 0;
			row = chessBoard[y+4];
			row.push(obj.GetComponent(SquareController));
			
			obj = Instantiate(black, Vector3(x*1.3,(y+1)*1.3,0),Quaternion.identity);
			obj.GetComponent(SquareController).hasPieceNum = 0;
			row.push(obj.GetComponent(SquareController));
			chessBoard[y+4] = row;

			obj = Instantiate(black, Vector3((x-1)*1.3,y*1.3,0),Quaternion.identity);
			obj.GetComponent(SquareController).hasPieceNum = 0;
			row = chessBoard[y+3];
			row.push(obj.GetComponent(SquareController));
			
			obj = Instantiate(white, Vector3(x*1.3, y*1.3, 0),Quaternion.identity);
			obj.GetComponent(SquareController).hasPieceNum = 0;
			row.push(obj.GetComponent(SquareController));
			chessBoard[y+3] = row;
		}
	}
	var frac : int;
	for(x=-3;x<=4;x++){
		obj = Instantiate(pawnBlack, Vector3(x*1.3,3.9,0),Quaternion.identity);
		obj.GetComponent(StateAssign).t = -2;
		obj1 = Instantiate(pawnWhite, Vector3(x*1.3,-2.6,0),Quaternion.identity);
		obj1.GetComponent(StateAssign).t = 2;
		
		frac= x;
		if ( frac % 2 ){
			comp= Instantiate(white, Vector3(x*1.3,-2.6,0),Quaternion.identity).GetComponent(SquareController);
			comp.piece = obj1;
			comp.hasPieceNum  = comp.hasPieceDen = 1;
			row = chessBoard[1];
			row.push(comp);
			chessBoard[1] = row;

			comp = Instantiate(black, Vector3(x*1.3, 3.9, 0),Quaternion.identity).GetComponent(SquareController);
			comp.piece = obj;
			comp.hasPieceNum  = comp.hasPieceDen = 1;
			row = chessBoard[6];
			row.push(comp);
			chessBoard[6] = row;
		}
		else {
			comp= Instantiate(black, Vector3(x*1.3,-2.6,0),Quaternion.identity).GetComponent(SquareController);
			comp.piece = obj1;
			comp.hasPieceNum  = comp.hasPieceDen = 1;
			row = chessBoard[1];
			row.push(comp);
			chessBoard[1] = row;

			comp = Instantiate(white, Vector3(x*1.3, 3.9, 0),Quaternion.identity).GetComponent(SquareController);
			comp.piece = obj;
			comp.hasPieceNum  = comp.hasPieceDen = 1;
			row = chessBoard[6];
			row.push(comp);
			chessBoard[6] = row;
		}
	}
	for (var i =0 ; i<8 ; i++)
		for (var j = 0;j<8;j++){
			getSquare(i,j).ind = new Array([i,j]);
			if (i==0 || i==1 || i==6|| i==7){
				comp = getSquare(i,j);
				comp.pieceScript = comp.piece.GetComponent(ColorAssign);
				comp.pieceScript.init();
			}
		}
}

function Update () {
	var click : int = 0;
	if(turn == chalData.color){
		if (Input.GetMouseButtonDown(0)){
			click = 1;
		}
		else if (Input.GetMouseButtonDown(1)){
			click = 2;
		}
		if (click){
			var posWorldMouse = getMousePos();
			for (var i =0 ; i<8 ; i++)
				for (var j = 0;j<8;j++){
					var square : SquareController  = getSquare(i,j);
					if (detSquare(square.gameObject.transform.position,posWorldMouse)){
						clickEvent(click, square, i, j);
					}
				}
		}
	}
}

private function clickEvent(y, square : SquareController, i : int, j : int){
	if ( mode == 0 ) {
			//Debug.Log("Has Piece  "+hasPiece.ToString());
		if (square.hasPieceNum > 0)
			selectPiece(y, square, i, j);
		}
		else {
			var selectedSquare : SquareController = getSquare(selInd);
			var selectedPiece : GameObject = selectedSquare.piece;
			//Debug.Log(selInd.ToString()+ " " + selInd.ToString());
			if (selInd[0] == i && selInd[1] == j){
				deselect(y, selectedSquare);
			}
			else if (getColor(selectedPiece) != turn){
				if (square.hasPieceNum > 0){
					deselect(-1, selectedSquare);
					selectPiece(y, square, i, j);
				}
			}
			else{
				var res; var validity;
				var move = 0 ;
				var kill = 0;
				Debug.Log("Evaluating Move for " + selectedPiece.ToString());
				Debug.Log("Identified tag "+selectedPiece.tag);
				if (selectedPiece.tag == "Pawn"){
					var temp = selectedPiece.GetComponent(StateAssign);
					res = isPawnValid(temp.t, selectedPiece.transform.position, square.gameObject.transform.position);
					if (res == 1 && mode == 2){
						Debug.Log("No Quantum move allowed on Pawn");
					}
					else if (res == 1){
						if (Mathf.Abs(temp.t)==2){
							temp.t/=2;
						}
						move = 1; 
					}
					else if ( res == 0) {
						kill = 1;
					}
					Debug.Log(res.ToString());
				}
				else{
					validity = isValid(selectedPiece.tag, selectedPiece.transform.position, square.gameObject.transform.position);
					if (validity) {
						kill = 1; move = 1;
					}
					Debug.Log("Valid Move : "+validity.ToString());
				}
				if (square.hasPieceNum > 0){
					if (move && selectedPiece.tag == "Pawn" && square.quantum() && secqMove(selectedSquare)){
						deselect(-1, selectedSquare);
						var selBool = calc(selectedSquare.hasPieceNum, selectedSquare.hasPieceDen, selectedSquare, -1);
						sendCalc(selectedSquare.ind[0], selectedSquare.ind[1], selBool);
						var sqBool = calc(square.hasPieceNum, square.hasPieceDen, square, -1);
						sendCalc(square.ind[0], square.ind[1], sqBool);
						if ( selBool && !sqBool){
							sendMove(i, j);
							move(selectedSquare, square);
						}
					}
					else if (kill){
						Debug.Log("Player Chose to Capture");
						if (square.piece.GetComponent(ColorAssign).color != turn){
							if (mode == 2){
								Debug.Log("You cannot kill with a quantum move");
							}else if(secqMove(selectedSquare)){
								if(square.quantum()){
									var tempBool = calc(selectedSquare.hasPieceNum, selectedSquare.hasPieceDen, selectedSquare, -1);
									sendCalc(selectedSquare.ind[0], selectedSquare.ind[1], tempBool);
									var squareBool = calc(square.hasPieceNum, square.hasPieceDen, square, -1);
									sendCalc(square.ind[0], square.ind[1], squareBool);
									if ( squareBool && tempBool){
										sendMove(i, j);
										kill(selectedSquare, square);
									}else if(tempBool){
										sendMove(i, j);
										move(selectedSquare, square);
									}
								}else{
									sendMove(i, j);
									kill(selectedSquare, square);
								}
							}
						}
						else{
							deselect(-1, selectedSquare);
							selectPiece(y, square, i, j);
						}
					}
					else {
						deselect(-1, selectedSquare);
						selectPiece(y, square, i, j);
					}
				}
				else if (move){
					if (secqMove(selectedSquare)){
						sendMove(i, j);
						move(selectedSquare, square);
					}
				}
			}
		}	
}

private function selectPiece(y: int, square : SquareController, i : int, j : int){
	mode = y;
	selInd = new Array([i,j]);
	paintSquare(y, square.gameObject);
	pieceField.text =  square.piece.tag + " " + ((100.0*square.hasPieceNum)/square.hasPieceDen).ToString()+ "%";
	if (square.quantum()){
		pieceField.text += "\n" + square.pieceScript.qState.ToString();
	}
	Debug.Log("Seleted "+square.piece.ToString());
}

function deselect(y : int, selectedSquare : SquareController){
	if (mode == y || y == -1){
		if (mode == 2 && selectedSquare.pieceScript.eIndex != -1){
			deselectEntangled(entangles[selectedSquare.pieceScript.eIndex]);
		}else{
			paintSquare(selectedSquare.sqColor, selectedSquare.gameObject);
		}
		mode = 0;
		Debug.Log("Deslected");
		//Debug.Log("Deslected "+selectedSquare.piece.ToString());
		selInd = null;	
		pieceField.text = "";
	}
	else{
		if(mode == 2 && selectedSquare.pieceScript.eIndex != -1){
			deselectEntangled(entangles[selectedSquare.pieceScript.eIndex]);
		}
		mode = y;
		paintSquare(y, selectedSquare.gameObject);
		Debug.Log("Changed Mode of "+selectedSquare.piece.ToString() +" to " + mode.ToString());
	}
}

//returns 1 if move and kill
//returns list of obstacles if invalid due to obstacle
//returns -1 if nothing is valid

function isValid(tag, p: Vector3, target: Vector3) : boolean {
	if (tag == "Rook"){
		if (floatCompare(p.y, target.y) || floatCompare(p.x, target.x)){
			if (Physics.Raycast(p, target - p, Vector3.Distance(target, p) - 1.3 )){
				Debug.Log("Rook can't jump");
				return false;
			}
			else {
				return true;
			}
		}
		else{
			return false;
		}
	}
	else if (tag == "Knight"){
		for(var i =-2;i<=2;i+=4)
		for(var j = -1;j<=1;j+=2){
			if ((floatCompare(target.x, p.x + i*1.3) && floatCompare(target.y, p.y + j*1.3)) || 
				(floatCompare(target.x, p.x + j*1.3) && floatCompare(target.y, p.y + i*1.3))  ){
				return true;
			}
		}
		return false;
	}
	else if (tag == "Bishop"){
		if( floatCompare(Mathf.Abs(target.y - p.y), Mathf.Abs(target.x - p.x))){
			if (Physics.Raycast(p, target - p, Vector3.Distance(target, p) - 1.84 )){
				Debug.Log("Bishop can't jump");
				return false;
			}
			else{
				return true;	
			}
		}
		else{
			return false;
		}
	}
	else if (tag == "Queen"){
		return isValid("Rook",p,target) || isValid("Bishop",p,target);
	}
	else if (tag == "King"){
		for(i =-1;i<=1;i+=2){
			if ((floatCompare(target.x, p.x + i*1.3) && floatCompare(target.y, p.y)) || 
				(floatCompare(target.y, p.y + i*1.3) && floatCompare(target.x, p.x)))
				return true;
		}
		return false;
	}
}

//Returns -1 if not valid
//Returns 1 if valid to move to empty
//Returns 0 if valid to make a kill
function isPawnValid(t : int, p: Vector3, target : Vector3) {
	if (floatCompare(target.y, p.y + t*1.3) || floatCompare(target.y, p.y + (t/2)*1.3)){
		if (floatCompare(target.x, p.x)){
			if(t == 2){
				if (Physics.Raycast(p, target - p, Vector3.Distance(target,p) - 1.3)){
					Debug.Log("Obstacle");
					return -1;
				}
				else{
					return 1;
				}
			}else{
				return 1;
			}
		}
		else if (Mathf.Abs(t) == 2) {
			Debug.Log("No diagonal on first move");
			return -1;
		}
		else if (floatCompare(Mathf.Abs(target.x - p.x), 1.3 )&& target.y != p.y){
			Debug.Log("Valid to Capture");
			return 0;
		}
		else{
			return -1;
		}
	}
	else{
		return -1;
	}
}


function move(selectedSquare : SquareController, square : SquareController){
	if (mode == 1){
		selectedSquare.piece.transform.position = square.gameObject.transform.position;	
		square.piece = selectedSquare.piece;
		square.pieceScript = selectedSquare.pieceScript;
		square.hasPieceNum = selectedSquare.hasPieceNum;
		square.hasPieceDen = selectedSquare.hasPieceDen;
		if (square.quantum()){
			var temp : Array;
			temp = (entangles[square.pieceScript.eIndex] as Hashtable)[square.pieceScript.index];
			temp[findIndex(temp, selectedSquare.ind)] = square.ind;
		}
		selectedSquare.hasPieceNum = 0;
		selectedSquare.piece = null;
		selectedSquare.pieceScript = null;
	} else{
		quantMove(selectedSquare, square);
	}
	deselect(-1, selectedSquare);
}

function findIndex (arr : Array, ind : Array): int{
	for (var x =0; x<arr.length; x++){
		if(indCompare(arr[x], ind)){
			break;
		}
	}
	if (x == arr.length){
		return -1;
	}else{
		return x;
	}
}
//ind parameter is -1 if moveCount = 1 else
//It is the index of the previously moved piece
function quantMove(selectedSquare : SquareController, square : SquareController){	
	Debug.Log("Quantum Move");
	var script : ColorAssign = selectedSquare.pieceScript;
	square.piece = Instantiate(selectedSquare.piece);
	square.piece.transform.position = square.gameObject.transform.position;
	var scriptSq : ColorAssign;
	square.piece.GetComponent(ColorAssign).qState = slice(script.qState);
	scriptSq = square.pieceScript = square.piece.GetComponent(ColorAssign);
	if (script.eIndex == -1){
		script.eIndex = script.index = scriptSq.eIndex = scriptSq.index = selectedSquare.piece.GetInstanceID();
		entangles.Add(script.eIndex, new Hashtable({script.index : new Array([selInd, square.ind])}));	
		Debug.Log("New eIndex in entangles with same index"+ script.eIndex.ToString());
		displayHash(entangles[script.eIndex]);
	}else{
		((entangles[script.eIndex] as Hashtable)[script.index] as Array).push(square.ind);
		Debug.Log("New entry in entangles at "+script.eIndex.ToString()+":"+script.index.ToString());
		Debug.Log((entangles[script.eIndex] as Hashtable)[script.index]);
	}
	square.hasPieceNum = selectedSquare.hasPieceNum;
	square.hasPieceDen = selectedSquare.hasPieceDen *= 2;
	var pieces : Array = (entangles[script.eIndex] as Hashtable)[script.index];
	for (var j =0 ; j<pieces.length; j++){
		if (!indCompare(square.ind, pieces[j]) && !indCompare(selectedSquare.ind, pieces[j])){
			//Debug.Log(pieces.length);
			//Debug.Log(pieces[j]);
			getSquare(pieces[j]).hasPieceNum*= 2;
			getSquare(pieces[j]).hasPieceDen*=2;
		}
	}
	if (moveCount == 1){
		Debug.Log("Storing 1st quantum move");
		prevE = script.eIndex; prevInd = script.index; prevSquare = selectedSquare; prevSq = square;
	}
	else{
		//Entangle with the previous piece
		var prevState : Array = slice(prevSquare.pieceScript.qState);
		var prevN : int = prevState.length; var N : int = script.qState.length;
		var temp : Array = prevState.concat(script.qState);
		var item  : Array; var tempo : Array;
		var tempPiece : ColorAssign; var x : int;
		for (var key in (entangles[prevE] as Hashtable).Keys){
			item = (entangles[prevE] as Hashtable)[key];
			for (var i = 0 ; i< item.length ; i++){
				Debug.Log(getSquare(item[i]).pieceScript.qState);
				if (key == prevInd){
					tempPiece = getSquare(item[i]).pieceScript;
					for (x = 0; x<N ; x++){
						tempPiece.qState.push(0);
					}
					if(indCompare(item[i], prevSquare.ind)){
						prevSquare.pieceScript.qState.push(true);
						Debug.Log("prevSquare "+prevSquare.pieceScript.qState.ToString());
					}else if(indCompare(item[i], prevSq.ind)){
						prevSq.pieceScript.qState.push(false);
						Debug.Log("prevSq "+prevSq.pieceScript.qState.ToString());
					}else{
						tempPiece.qState.push(0);	
					}	
				}else{
						getSquare(item[i]).hasPieceNum *= 2;
						getSquare(item[i]).hasPieceDen *= 2;	
						tempPiece = getSquare(item[i]).pieceScript;
						for (x = 0; x<N ; x++){
							tempPiece.qState.push(0);
						}
						tempPiece.qState.push(0);
				}
			}
		}
		for (key in (entangles[script.eIndex] as Hashtable).Keys){
			item = (entangles[script.eIndex] as Hashtable)[key];
			for (i = 0 ; i< item.length ; i++){
				if (key == script.index){
					tempo = [];
					tempPiece = getSquare(item[i]).pieceScript;
					for (x = 0; x<prevN ; x++){
						tempo.push(0);
					}
					tempPiece.qState = tempo.concat(tempPiece.qState);
					if (indCompare(item[i], selectedSquare.ind)){
						script.qState.push(false);
						Debug.Log("selectedSquare "+script.qState.ToString());
					} else if(indCompare(item[i], square.ind)){
						scriptSq.qState.push(true);
						Debug.Log("square "+scriptSq.qState.ToString());
					}else{
						tempPiece.qState.push(0);
					}
				}else{
					getSquare(item[i]).hasPieceNum *= 2;
					getSquare(item[i]).hasPieceDen *= 2;
					tempo = [];
					tempPiece = getSquare(item[i]).pieceScript;
					for (x = 0; x<prevN ; x++){
						tempo.push(0);
					}
					tempPiece.qState = tempo.concat(tempPiece.qState);
					tempPiece.qState.push(0);
				}
			}
		}
		var eIndsave : int = script.eIndex;
		concatHash(entangles[prevE], entangles[eIndsave]);
		Debug.Log(eIndsave.ToString() +" merged with "+prevE.ToString());
		entangles.Remove(eIndsave);
		displayHash(entangles[prevE]);
		Debug.Log("Removed eIndex " + eIndsave.ToString());
		//script.eIndex = scriptSq.eIndex  = prevE;
	}
}

function indCompare(i : Array, j: Array) : boolean{
	return i[0] == j[0] && i[1] == j[1];
}

function kill(selectedSquare : SquareController, square : SquareController){
	Destroy(square.piece);
	square.piece = selectedSquare.piece;
	square.pieceScript = selectedSquare.pieceScript;
	square.piece.transform.position = square.gameObject.transform.position;
	if (square.quantum()){
		var temp : Array;
		temp = (entangles[square.pieceScript.eIndex] as Hashtable)[square.pieceScript.index];
		temp[findIndex(temp, selectedSquare.ind)] = square.ind;
	}
	selectedSquare.init();
	deselect(-1, selectedSquare);
}

function slice(arr : Array){
	return arr.slice(0,arr.length);
}

function calc(num : int, den : int, sq : SquareController, res) : boolean{
	deselect(-1, sq);
	var i : int;
	Debug.Log(sq);
	Debug.Log(sq.pieceScript);
	Debug.Log(sq.pieceScript.eIndex);
	Debug.Log(sq.pieceScript.index);
	Debug.Log(entangles[sq.pieceScript.eIndex]);
	var temp : Array = (entangles[sq.pieceScript.eIndex] as Hashtable)[sq.pieceScript.index];
	if (res == -1 ) res = Random.Range(0, den) < num;
	if ( res){
		Debug.Log("The piece was determined to be there");
		for (i = 0 ; i<temp.length;i++){
			if (!indCompare(temp[i], sq.ind)){
				Destroy(getSquare(temp[i]).piece);
				getSquare(temp[i]).init();
			}
		}
		removeIndex(sq.pieceScript.index, sq.pieceScript.eIndex);
		if (entangles.Contains(sq.pieceScript.eIndex)){
			finState(sq.pieceScript.qState, entangles[sq.pieceScript.eIndex]);
		}
		sq.hasPieceNum = sq.hasPieceDen = 1;
		sq.pieceScript.init();
		return true;
	}else{
		Debug.Log("The piece was determined to be not there");
		elemState(sq.pieceScript.qState, entangles[sq.pieceScript.eIndex], sq.pieceScript.index);
		elemPiece(temp, findIndex(temp, sq.ind));	
		return false;
	}
}

private function removeIndex(index : int, eIndex : int){
	(entangles[eIndex] as Hashtable).Remove(index);
	if ((entangles[eIndex] as Hashtable).Count == 0){
		entangles.Remove(eIndex);
	}
}

//Function to send the move across the network to the opponent
function sendMove(i,j){
	new LogEventRequest()
		.SetEventKey("sendMove")
		.SetEventAttribute("iniPos", getPos(selInd[0], selInd[1]))
		.SetEventAttribute("finPos", getPos(i,j))
		.SetEventAttribute("mode",mode)
		.SetEventAttribute("oppId",chalData.opponent.Id)
		.Send(function(response) {
    });
	moveCount++;
	if (moveCount == mode){	
		changeTurn();
		moveCount = 0;
	}	
}

//Function to send the measurement on a piece to the opponent
function sendCalc(i,j,res){
	new LogEventRequest()
		.SetEventKey("sendCalc")
		.SetEventAttribute("pos", getPos(i,j))
		.SetEventAttribute("result", res.ToString())
		.SetEventAttribute("oppId",chalData.opponent.Id)
		.Send(function(response) {

		});
	} 

function handleOpponentMove(message : ScriptMessage){
	var data : GSData = message.Data;  var i : int; var j : int;
	if (data.GetString("event") == "sendMove"){
		var temp = data.GetString("finPos").Split(","[0]);
		var finPosSquare = getSquare(parseInt(temp[0]),parseInt(temp[1]));
		temp = data.GetString("iniPos").Split(","[0]);
		i = parseInt(temp[0]); j = parseInt(temp[1]);
		var iniPosSquare = getSquare(i,j);
		selectPiece(data.GetInt("mode").Value, iniPosSquare, i, j);
		oppMove(finPosSquare, iniPosSquare);
	}else{
		var temp1 = data.GetString("pos").Split(","[0]);
		i = parseInt(temp1[0]); j = parseInt(temp1[1]);Debug.Log(i); Debug.Log(j);
		var tempSq  = getSquare(i, j);
		Debug.Log(tempSq); Debug.Log(data.GetString("result") == "true");
		calc(tempSq.hasPieceNum, tempSq.hasPieceDen, tempSq, data.GetString("result") == "true");
	}
}

function oppMove(finPosSquare : SquareController, iniPosSquare : SquareController){
	moveCount++;
	if (moveCount == mode){	
		changeTurn();
		moveCount = 0;
	}
	if (finPosSquare.hasPieceNum > 0){
		kill(iniPosSquare, finPosSquare);
	}else{
		move(iniPosSquare, finPosSquare);
	}
}

private function elemState(qState : Array, hash : Hashtable, index : int){
	var temp : Array; var tempState : Array;var tempHash : Hashtable = hash.Clone(); var tempC : Array;
	var tempInd : int;
	for (key in tempHash.Keys){
		temp = hash[key]; tempC = temp.slice(0,temp.length);
		for (var i = 0; i<tempC.length; i++){
			tempState = getSquare(tempC[i]).pieceScript.qState;
			if (tempState.length != 0){
			getSquare(tempC[i]).hasPieceDen -= countNum(qState);
			if (key != index ){	
				Debug.Log(qState.length); Debug.Log(tempState.length);		
				for (var j =0 ; j<qState.length ; j++){
					if (qState[j] != 0 && tempState[j] != qState[j]){
						if(tempState[j] == 0){
							tempState[j] = !qState[j];
						}else{
							break;
						}
					}
				}
				getSquare(tempC[i]).hasPieceNum = countNum(tempState);
				if (j == qState.length){
					tempInd = findIndex(temp, getSquare(tempC[i]).ind);
					elemPiece(temp, tempInd);
				}
			}
			}
		}
	}
}

private function countNum(state : Array) : int{
	var c : int = 0;
	for (var x =0 ;x<state.length; x++){
		if (state[x] == 0){
			c++;
		}
	}
	return 2^c;
}

private function changeProb(pieces : Array, ai : int, change : int){
	for (var x =0 ; x<pieces.length; x++){
		if (x == ai){
			getSquare(pieces[x]).hasPieceNum -= change;
		}
		getSquare(pieces[x]).hasPieceDen -= change; 
	}
}

private function elemPiece(temp : Array, i : int){
	Debug.Log("Removing at "+getSquare(temp[i]).ind.ToString() );
    Destroy(getSquare(temp[i]).piece);
	getSquare(temp[i]).init();
	temp.RemoveAt(i);
	if (temp.length == 1){
		var tempPiece : SquareController;
		tempPiece = getSquare(temp[0]);
		Debug.Log("Finalising the piece " + tempPiece.piece.ToString());
		removeIndex(tempPiece.pieceScript.index, tempPiece.pieceScript.eIndex);
		tempPiece.hasPieceNum = tempPiece.hasPieceDen = 1;
		Debug.Log(tempPiece.ind);
		Debug.Log(getSquare(tempPiece.ind).hasPieceDen);
		tempPiece.pieceScript.init();
	}
}

private function finState(qState : Array, hash : Hashtable){
	var temp : Array; var tempState : Array;
	var tempHash : Hashtable = hash.Clone();var tempC : Array ;
	var tempInd : int;
	for (key in tempHash.Keys){		
			temp = hash[key]; tempC = temp.slice(0,temp.length);
			for (var i = 0; i<tempC.length ; i++){
				tempState = getSquare(tempC[i]).pieceScript.qState;
				if (tempState.length != 0){
				getSquare(tempC[i]).hasPieceDen = countNum(qState);
				Debug.Log(qState.length); Debug.Log(tempState.length);
				for (var j =0 ; j<qState.length ; j++){
					if (qState[j] != 0 && tempState[j] != qState[j]){
						if(tempState[j] == 0){
							tempState[j] = qState[j];
						}else{
							break;
						}
					}
				}
				tempInd = findIndex(temp, getSquare(tempC[i]).ind);
				getSquare(tempC[i]).hasPieceNum = countNum(tempState);
				if (j != qState.length){
				//elemPiece(getSquare(temp[i]), i);
					Debug.Log(getSquare(temp[1]).hasPieceNum.ToString()+getSquare(temp[1]).hasPieceDen.ToString());
					elemPiece(temp, tempInd);
					Debug.Log(temp.length);
					if (temp.length == 1){
						Debug.Log(getSquare(temp[0]).hasPieceNum.ToString()+getSquare(temp[0]).hasPieceDen.ToString());
					}
				}} else {
					Debug.Log(getSquare(temp[0]).ind);
					Debug.Log(getSquare(tempC[i]).ind);
					Debug.Log(getSquare(temp[0]).hasPieceNum.ToString()+getSquare(temp[0]).hasPieceDen.ToString());}
			}		
	}
}

private function paintEntangled(script : ColorAssign, scriptSq : SquareController){
	if(script.eIndex != -1){
		var temp : Array;
		for (item in (entangles[script.eIndex] as Hashtable).Keys){
			temp = (entangles[script.eIndex] as Hashtable)[item];
			for (var i =0 ;i<temp.length;i++){
				if (item == script.index){
					if(!indCompare(temp[i], scriptSq.ind)){
						paintSquare(sameCol, getSquare(temp[i]).gameObject);
					}
				}else{
					paintSquare(entCol, getSquare(temp[i]).gameObject);
				}
			}
		}
	}
}

private function deselectEntangled(hash : Hashtable){
	var temp : Array;var tempSquare : SquareController;
	for (item in hash.Keys){
		temp = hash[item];
		for (var i =0 ;i<temp.length;i++){
			tempSquare = getSquare(temp[i]);
			paintSquare(tempSquare.sqColor, tempSquare.gameObject);
		}
	}
}

private function getMousePos(){
	var posMouse = Input.mousePosition ;
	return Camera.main.ScreenToWorldPoint(Vector3(posMouse.x,posMouse.y,Camera.main.nearClipPlane));
}

private function detSquare(pos : Vector3, p : Vector3){
	return Mathf.Abs(p.x - pos.x) < 0.65 && Mathf.Abs(p.y - pos.y) < 0.65;
}

private function getSquare(i : int, j: int) : SquareController{
	return (chessBoard[i] as Array)[j];
}

private function getSquare(pos : Array) : SquareController{
	return (chessBoard[pos[0]] as Array)[pos[1]];
}

private function getColor(piece : GameObject){
	return piece.GetComponent(ColorAssign).color;
}

private function secqMove(square : SquareController) : boolean{
	if (moveCount == 1){
		if (mode == 2){
			if (prevE != -1 && prevE == square.pieceScript.eIndex ){
				Debug.Log("The piece is entangled with the previous piece");
				return false;
			}
			return true;
		}else{
			Debug.Log("Only quantum move allowed Now");
			return false;
		}
	}else{
		return true;
	}
}

//Sets red for quantum move
//Sets yellow for classic move
private function paintSquare(m : int, square : GameObject){
	if (m == 1){
		square.GetComponent(SpriteRenderer).color = Color.yellow;
	}
	else{
		square.GetComponent(SpriteRenderer).color = Color.red;
		var temp : ColorAssign = square.GetComponent(SquareController).pieceScript;
		paintEntangled(temp, square.GetComponent(SquareController));
	}
}

private function displayHash(hash : Hashtable){
	//Debug.Log(hash.Keys as Array);
	for (var item in hash.Keys ){
		Debug.Log(hash[item]);
	}
}

private function concatHash(hash1 : Hashtable, hash2 : Hashtable){
	for (var key in hash2.Keys){
		hash1.Add(key, hash2[key]);
		for (var piece in hash2[key]){
			getSquare(piece).pieceScript.eIndex = prevE;
		}
	}
}
private function paintSquare(col : Color, square : GameObject){
	//Debug.Log(col);
	square.GetComponent(SpriteRenderer).color = col;
}
private function floatCompare(x: float,y : float){
	return Mathf.Abs(x - y) < 0.1;
}

//returns string 
private function getPos(i : int,j: int) : String{
	return i.ToString() + ',' + j.ToString() ;
}

private function changeTurn(){
	/*
	if (turn == "white"){
		turn = "black";
	}
	else{
		turn = "white";
	}
	Debug.Log(turn + "'s turn");
	*/
}

