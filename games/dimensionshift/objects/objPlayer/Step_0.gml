var dt = delta_time/100000;
//Inputs

keyRight = keyboard_check(ord("D"));
keyLeft = keyboard_check(ord("A"));
keyUp = keyboard_check(ord("W"));
keyDown = keyboard_check(ord("S"));



spd = 10*dt;

// Movement
inputDirection = point_direction(0, 0, keyRight - keyLeft, keyDown - keyUp);
inputMagnitude = (keyRight - keyLeft != 0) || (keyDown - keyUp != 0);
vx = lengthdir_x(spd * inputMagnitude, inputDirection);
vy = lengthdir_y(spd * inputMagnitude, inputDirection);

if(objDimensions.currentdimension==1){
	if(place_meeting(x+vx, y,  objParentSolid1)){
		vx = 0;
	}

	if(place_meeting(x, y+vy, objParentSolid1)) {
		vy= 0;
	}

	if(place_meeting(x+vx, y+vy, objParentSolid1)){
		vx = 0;
		vy = 0;
	}
	
	// Collision Depths
	var collision = ds_list_create();
	
	with(hitbox)instance_place_list(x,y,objHitbox1, collision, true);
	for(var i=0; i < ds_list_size(collision); i++){
		
		if(y>collision[| i].y){
			collision[| i].object.depth=depth+5;
			
		}else{
			collision[| i].object.depth=depth-5;

		}
	}
	
}
if(objDimensions.currentdimension==2){
	if(place_meeting(x+vx, y,  objParentSolid2)){
		vx = 0;
	}

	if(place_meeting(x, y+vy, objParentSolid2)) {
		vy= 0;
	}

	if(place_meeting(x+vx, y+vy, objParentSolid2)){
		vx = 0;
		vy = 0;
	}
	
	// Collision Depths
	var collision = ds_list_create();
	
	with(hitbox)instance_place_list(x,y,objHitbox2, collision, true);
	for(var i=0; i < ds_list_size(collision); i++){
		
		if(y>collision[| i].y){
			collision[| i].object.depth=depth+5;
			
		}else{
			collision[| i].object.depth=depth-5;

		}
	}
}


y += vy;
x += vx;

// Sprite

if(mouse_x>x) image_xscale=1;
else image_xscale=-1;

