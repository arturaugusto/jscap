ngspice -b rl_transient_01.cir
convert -background white -alpha remove rl_transient_01.ps rl_transient_01.png
sed -n 4,4p tmp.txt | sed -e 's/[[:space:]]\+/\t/g' > rl_transient_01.tsv
sed -n 6,100000p tmp.txt >> rl_transient_01.tsv


ngspice -b rc_transient_01.cir
convert -background white -alpha remove rc_transient_01.ps rc_transient_01.png
sed -n 4,4p tmp.txt | sed -e 's/[[:space:]]\+/\t/g' > rc_transient_01.tsv
sed -n 6,100000p tmp.txt >> rc_transient_01.tsv

rm tmp.txt
rm ./*.ps