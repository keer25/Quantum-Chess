# Quantum-Chess


Quantum chess is a game where the classic chess game rules have been modified to follow quantum mechanic principles. In quantum chess you can do classical moves which follow all the normal chess game rules. In addition to that, there are quantum moves in which you can move two pieces at the same time which are not entangled already. A quantum move can lead to chess pieces existing in superposition of states and getting entangled to each other. A quantum move can be made on all pieces except pawn.

The principles of quantum mechanics I have decided to implement so far :-

1) Quantum Superposition
     In quantum mechanics, instead of thinking about a particle being in one state or changing between a variety of states, particles are thought of as existing across all the possible states at the same time. Hence the particles are said to be in a superposition of states. 
How is this implemented in the game?
    When you make a quantum move, you move two pieces the board becomes a superposition of states where the first move and the second move has occurred, i.e the pieces exist in different positions with varied probabilities.

2) Quantum Entanglement
         Two particles are said to be entangled when determining the state of one can determine the state of other entangled states.
How is this implemented in the game?
     When you make a quantum move on the two pieces they get entangled. And hence determining the position of one chess piece can determine the positions of the entangled pieces.

3)Wave function collapse
         In quantum mechanics, wave function collapse is said to occur when a wave function—initially in a superposition of several eigenstates—appears to reduce to a single eigenstate.
How is this implemented in the game?
     When a chess piece in quantum state is being captured or trying to capture another chess piece, it is measured and its position is determined. This can be considered a collapse in superposition. This can also collapse the superposition of entangled pieces.

You can skip all the physics above and jump over to the game rules below. Playing the chess game will automatically teach you all the above physics!!

Game Rules :

    A quantum move can be made on all pieces except pawn.
    If the player chooses to make a quantum move they can move two pieces at the same time and you can see that both the pieces are at both the initial and final positions. On clicking the chess pieces at either position reveals the probability of the piece being there. You can see it as the chances that the given piece is in that position. And of course the sum of the probabilities of the chess piece being in different positions is equal to 1.
    When you move two pieces in a quantum move they get entangled. You need not have a very good understanding of this to play the game. Basically measuring one chess piece in a quantum state to determine its position will affect the probabilities of the entangled states. The entanglement arises from the fact that when two pieces are moved in a quantum move each move occurs with 50% probability each which determines the pieces' position probabilities.
    Measuring a piece is basically determining which position it is in. This is done by the software considering all the position probabilities.
    The position of a piece is measured when it is being captured or is trying to capture.(Since we don't want pieces that are dead and alive at the same time)And only when the piece being captured and the piece that is capturing are determined to be in their desirable positions the capture happens.
       

