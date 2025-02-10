x=objPlayer.x
y=objPlayer.y+2
image_angle = point_direction(x, y, mouse_x, mouse_y);
if(mouse_x>x) image_yscale=1;
else image_yscale=-1;
var dt = delta_time/100000;


if mouse_check_button_pressed(mb_left) and cd <=0{
	var direct = point_direction(x, y, mouse_x, mouse_y)
	with(instance_create_layer(x+lengthdir_x(6, direct), y+lengthdir_y(6, direct), "Instances", objPlayerProjectile)) {
		dir=direct
		spd=20
		time=10
		dmg=10
		image_angle=dir
	}
	cd+=firerate;
}
if cd!=0 cd--;
