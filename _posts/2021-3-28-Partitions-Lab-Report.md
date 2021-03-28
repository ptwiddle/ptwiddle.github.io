---
layout: post
title: Partitions Lab
permalink: Partitions-Lab-Report
comments: True
---

Last summer I ran a small summer research program about partitions, for students from Sheffield and a few others that heard about it.  It was laid back -- everyone, including me, was adapting to the pandemic, which is why I wanted to run it (figuring many students would have had their plans cancelled), so we didn't push it too hard.  But it was certainly helpful to me, and there were a few student outputs -- Roan James gave a nice talk about Ramanujan-type congruences for Andrews spt-function, and Dominic Littlewood wrote some Java code that implemented the bijection between partitions and the charge zero part of Dirac's Electron sea.

The script is included below.  Maybe I will add some description of the bijection, but briefly the circles are energy states for electrons, and the ones filled with black dots are electrons.  Click and hold an electron or an empty state with your mouse and drag it to place it somewhere else -- the resulting border strip being added or removed to the partition will be highlighted while you do this.

<svg id="root" viewbox="-1 -20 101 100">
	<g id="partition" transform="rotate(-45)">
		<polyline fill="none" stroke="black" points="0,0 0,70 70,70" />
	</g>
</svg>

<script src="../dominic.js"></script>
