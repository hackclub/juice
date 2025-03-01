var dt = delta_time/100000;
var stepspd = spd*dt;

vx = lengthdir_x(stepspd, dir);
vy = lengthdir_y(stepspd, dir);
x+=vx
y+=vy
time -=dt;
if(objDimensions.currentdimension==1){
	if(time <=0 or place_meeting(x, y ,objBulletProof1)) instance_destroy(self)
	var enemy = instance_place(x, y, objEnemyParent1);
	if(enemy){
		enemy.hp-=dmg
		enemy.knockback(enemy.kblength, dir, enemy.kbspd);
		instance_destroy(self)
	}
}
if(objDimensions.currentdimension==2){
	if(time <=0 or place_meeting(x, y ,objBulletProof2)) instance_destroy(self)
	var enemy = instance_place(x, y, objEnemyParent2);
	if(enemy){
		enemy.hp-=dmg
		enemy.knockback(enemy.kblength, dir, enemy.kbspd);
		instance_destroy(self)
	}
}