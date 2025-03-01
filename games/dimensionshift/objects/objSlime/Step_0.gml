event_inherited();


if(active) {
	var collision = ds_list_create();
	
	instance_place_list(x,y,objHitbox1, collision, true);
	for(var i=0; i < ds_list_size(collision); i++){
		
		if(y>collision[| i].y){
			depth=collision[| i].object.depth-1
			
		}else{
			depth=collision[| i].object.depth+1
		}
	}
	if(!kb){
		var dt = delta_time/100000;

		mp_potential_step_object(objPlayer.x, objPlayer.y, dt*spd, objParentSolid1)
		
	}
}

