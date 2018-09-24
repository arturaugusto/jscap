# Get editor window name
#aw=`xdotool getactivewindow`
xdotool windowactivate `xdotool search --name 'index.html'` ; sleep 0.1 ; xdotool key F5
#xdotool windowactivate $aw;sleep 0.1;
xdotool windowactivate `xdotool search --name ' Sublime Text'`;sleep 0.1

