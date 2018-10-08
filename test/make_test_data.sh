ngspice -b rl_transient_01.cir
sed -n 4,4p tmp.txt | sed -e 's/[[:space:]]\+/\t/g' > rl_transient_01.tsv
sed -n 6,100000p tmp.txt >> rl_transient_01.tsv

ngspice -b rc_transient_01.cir
sed -n 4,4p tmp.txt | sed -e 's/[[:space:]]\+/\t/g' > rc_transient_01.tsv
sed -n 6,100000p tmp.txt >> rc_transient_01.tsv

rm tmp.txt
