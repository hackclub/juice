if(active){
if hp<=0 instance_destroy(self);
}
var dt = delta_time/100000;

if(kbcd>0){
	var knockbackvy=lengthdir_y(kbcurrentspd,kbdir);
	var knockbackvx=lengthdir_x(kbcurrentspd,kbdir);
	if(place_meeting(x+knockbackvx*dt, y,  objParentSolid1)){
		knockbackvx = 0;
	}

	if(place_meeting(x, y+knockbackvy*dt, objParentSolid1)) {
		knockbackvy= 0;
	}

	if(place_meeting(x+knockbackvx*dt, y+knockbackvy*dt, objParentSolid1)){
		knockbackvx = 0;
		knockbackvy = 0;
	}
	x+=knockbackvx*dt;
	y+=knockbackvy*dt;
	kbcd-=dt;
	kbcurrentspd-=dt*kbchange
	if(kbcd<0)kbcd=0;
} else if(kbcd==0){
	image_speed=defaultimagespeed;
	image_blend = c_white;
	kbcd--;
	kb=false
}