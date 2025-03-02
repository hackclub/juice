var dt = delta_time/100000;
if (flashAlpha>0){
	draw_sprite_stretched_ext(sprBackground,0,0,0,display_get_gui_width(),display_get_gui_height(),c_white,flashAlpha);
} else if (redFlashAlpha>0){
	draw_sprite_stretched_ext(sprRed,0,0,0,display_get_gui_width(),display_get_gui_height(),c_white,redFlashAlpha);
}

if(flashAlpha>=0){flashAlpha-=.1*dt;}
if(redFlashAlpha>=0){redFlashAlpha-=.05*dt;}