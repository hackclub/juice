var dt = delta_time/100000;
if(cd<=0){
	if(keyboard_check_pressed(vk_space)){
	
		if(currentdimension==1){
			var collide = false
			with(objPlayer) collide=place_meeting(x,y, objParentSolid2);
			if(!collide) {
				alarm_set(0, 1);
				flashAlpha=.75;
				cd=maxcd;
			} else {
				redFlashAlpha=.5
				cd=5;
			}
		
		
		} else if (currentdimension==2){
			var collide = false
			with(objPlayer) collide=place_meeting(x,y, objParentSolid1);
			if(!collide) {
				alarm_set(1, 1);
				flashAlpha=.75;
				cd=maxcd;
			} else {
				redFlashAlpha=.5
				cd=5;
			}
		
		}
	
	}
}
if cd>0 cd-=dt;