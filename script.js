const BOOK = {
	title: 'Almost, in Every Way',
	kicker: '',
	subtitle:'a soul who yearns',
	author: 'Caghs',
	owner: 'Whabbids',
	year: 'MMXXVI',
	endNote: 'All is through the lens of a philosophical worldview.'
};

const POEMS = [
	{
		title: 'On What Must Be',
		date: 'March 2, 2026',
		content: `
			I don't resent people for being who they are, nor do i blame myself for becoming someone they can no longer understand. 
            
            Everything moves according to its nature, and every action is a consequence of something that came before it. I have no desire to control what was never mine to command. 
            
            I'll let people be, let things take their course, and let time reveal what reason alone cannot. Even when I find myself in a flow that slowly drains me, I won't mistake my ability to endure for a reason to remain.
            
		`
	},
	{
		title: 'On Pride and Reason',
		date: 'April 27, 2026',
		content: `
			I've come to understand that the ego is often the mind's attempt to protect an identity that was never permanent to begin with. People defend their pride as if being wrong diminishes their worth. 
            
            The ego seeks to be right, while reason seeks what is true. 
            
            The difference is that one protects the self from humiliation, while the other allows the self to be corrected.
		`
	},
	{
		title: 'Itself Caged',
		date: 'July 21, 2026',
		content: `
			A bird may spend its whole life inside a cage with an open door, watching the sky but never daring to fly. 
            
            Not because its wings are broken, but because it has learned to see the cage as the only place it can survive.
		`
	},
	{
		title: 'Two Truths and a Lie',
		date: 'August 9, 2026',
		content: `
			Not every flower that blooms will bear fruit, and not every thorn will draw blood. 
            
            Some roots grow deep beneath the soil, while others only pretend to hold the ground. 
            
            Not every seed that falls will grow, and not every tree that stands will survive.

		`
	},
	{
		title: 'Claws of Silent Wrath',
		date: 'September 3, 2026',
		content: `
			They feared the jaguar for its teeth,
            yet never asked what made it bite.

            They called it cruel, they called it wild,
            as if it had never been a child.
            
            They saw its claws, but not its pain,
            then blamed the beast for its own chains.
            
            How the world loves to decide
            who deserves to live with pride.

            When the beast no longer bends,
            they call it lost, they call it changed.
		`
	},
    {
		title: 'Crooked Scale',
		date: 'September 15, 2026',
		content: `
			If people condemn the very sins they commit, do they hate the wrong itself, or only when they are the ones who suffer from it?

            They condemn the sin when they become the victims, yet excuse it when they are the ones who benefit from it.  
		`
	},
	{
		title: 'Beau Contradictions',
		date: 'September 23, 2026',
		content: `
			They preach of peace with a knife in their hand, then call you a monster for daring to stand.

            They demand that you change, yet resent what you become, then ask why you left when they made you feel numb.

            They tell you to trust, then give you a reason to doubt, and call you too cold when you finally shut out.
		`
	},
    {
		title: 'Chemical Conciousness',
		date: 'September 23, 2026',
		content: `
		    If every thought is a chemical reaction, then who is the one observing the reaction?  	

            Well, the brain is both the reaction and the observer. But if consciousness is merely the brain observing itself, then what allows us to distinguish between the thoughts we create and the self that experiences them?

		`
	}
];

(() => {
	'use strict';

	const $ = id => document.getElementById(id);
	const book = $('book');
	const stage = $('stage');
	const floor = $('floor');
	const scene = $('scene');
	const countEl = $('count');
	const btnPrev = $('prev');
	const btnNext = $('next');
	const hint = $('hint');
	const sky = $('sky');
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const h = (tag, cls, txt) => {
		const e = document.createElement(tag);
		if (cls) e.className = cls;
		if (txt != null) e.textContent = txt;
		return e;
	};
	const frag = html => {
		const t = document.createElement('template');
		t.innerHTML = html.trim();
		return t.content.firstElementChild;
	};
	const dedent = s => {
		const lines = String(s).replace(/\t/g, '  ').replace(/^\n+|\s+$/g, '').split('\n');
		const indent = Math.min(1e9, ...lines.filter(line => line.trim()).map(line => line.match(/^ */)[0].length));
		return lines.map(line => line.slice(indent === 1e9 ? 0 : indent).replace(/\s+$/, '')).join('\n');
	};

	const B = Object.assign({ title: 'Almost, in Every Way', kicker: 'A Book of Minds', subtitle: '', author: '', owner: '', year: '', endNote: '' }, BOOK);
	const P = POEMS;
	document.title = B.title || 'Almost, in Every Way';
	const DIVIDER = '<svg class="div" viewBox="0 0 180 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round"><path d="M6 8H72M108 8H174"/><circle cx="77" cy="8" r="1.3" fill="currentColor"/><circle cx="103" cy="8" r="1.3" fill="currentColor"/><path d="M90 1.5Q90.8 7.2 97 8Q90.8 8.8 90 14.5Q89.2 8.8 83 8Q89.2 7.2 90 1.5Z" fill="currentColor"/></g></svg>';

	function starfield() {
		let seed = 7;
		const random = () => {
			seed = seed + 0x6D2B79F5 | 0;
			let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
			t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		};
		let svg = '<svg class="cvstars" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="currentColor">';
		for (let i = 0; i < 46; i++) {
			svg += `<circle cx="${(random() * 100).toFixed(1)}" cy="${(random() * 140).toFixed(1)}" r="${(.2 + random() * .55).toFixed(2)}" opacity="${(.25 + random() * .6).toFixed(2)}"/>`;
		}
		return svg + '</svg>';
	}

	const S = [{ t: 'title' }, ...P.map((p, i) => ({ t: 'poem', p, i })), { t: 'end' }];
	if (S.length % 2) S.splice(S.length - 1, 0, { t: 'blank' });
	const K = S.length / 2;
	const N = K + 2;

	function pageNode(s) {
		const pg = h('div', 'pg');
		if (s.t === 'title') {
			pg.classList.add('tp');
			pg.append(h('div', 'frame'), h('h1', 'tt', B.title), frag(DIVIDER));
			if (B.subtitle) pg.append(h('p', 'ts', B.subtitle));
			if (B.author) pg.append(h('p', 'ta', B.author));
			if (B.year) pg.append(h('p', 'td', B.year));
		} else if (s.t === 'poem') {
			const poem = s.p;
			if (poem.title) pg.append(h('h2', 'pt', poem.title));
			if (poem.date) pg.append(h('p', 'pd', poem.date));
			pg.append(frag(DIVIDER));
			const wrapper = h('div', 'pbw');
			wrapper.append(h('div', 'pb', dedent(poem.content || '')));
			pg.append(wrapper, h('div', 'pn', '· ' + (s.i + 1) + ' ·'));
		} else if (s.t === 'end') {
			pg.classList.add('ep');
			pg.append(frag(DIVIDER), h('div', 'fin', 'Fin'));
			if (B.endNote) pg.append(h('p', 'note', B.endNote));
			pg.append(frag(DIVIDER));
		} else {
			pg.classList.add('bl');
		}
		return pg;
	}

	function paperFace(side, page) {
		const face = h('div', 'face paper ' + side);
		face.append(pageNode(page), h('div', 'shade ' + (side === 'front' ? 'f' : 'b')));
		return face;
	}

	function boardFace(side, kind) {
		const face = h('div', 'face cv leather ' + side);
		face.append(frag(starfield()), h('div', 'hinge'));
		if (kind === 'cover') {
			const content = h('div', 'cv-in');
			const middle = h('div', 'cv-title-group');
			middle.style.cssText = 'display:flex;flex-direction:column;align-items:center';
			const coverTitle = h('h1', 'cv-ttl');
			const titleLines = B.title === 'Almost, in Every Way' ? ['Almost,', 'in', 'Every Way'] : [B.title];
			titleLines.forEach((line, index) => {
				if (index) coverTitle.append(document.createElement('br'));
				coverTitle.append(document.createTextNode(line));
			});
			middle.append(coverTitle);
			if (B.subtitle) middle.append(h('p', 'cv-sub', B.subtitle));
			middle.append(frag(DIVIDER));
			if (B.kicker) content.append(h('div', 'cv-kick', B.kicker.toUpperCase()));
			content.append(middle, h('div', 'cv-auth', B.author || ''));
			face.append(content);
		} else if (kind === 'endpaper' || kind === 'endpaper2') {
			face.classList.add('has-endp');
			const endpaper = h('div', 'endp');
			if (B.owner && kind === 'endpaper') {
				const plate = h('div', 'plate');
				plate.append(h('div', 'k', 'EX LIBRIS'), h('div', 'o', B.owner));
				endpaper.append(plate);
			}
			face.append(endpaper);
		}
		face.append(h('div', 'shade ' + (side === 'front' ? 'f' : 'b')));
		return face;
	}

	const leaves = [];
	function addLeaf(front, back) {
		const element = h('div', 'leaf');
		element.append(front, back);
		book.append(element);
		leaves.push({ el: element, shF: front.querySelector('.shade'), shB: back.querySelector('.shade'), p: 0 });
	}

	addLeaf(boardFace('front', 'cover'), boardFace('back', 'endpaper'));
	for (let j = 1; j <= K; j++) addLeaf(paperFace('front', S[2 * j - 2]), paperFace('back', S[2 * j - 1]));
	addLeaf(boardFace('front', 'endpaper2'), boardFace('back', 'back'));
	const edgeR = h('div', 'edge r');
	const edgeL = h('div', 'edge l');
	const castR = h('div', 'cast r');
	const castL = h('div', 'cast l');
	book.append(edgeR, edgeL, castR, castL);

	for (let i = 0; i < 90; i++) {
		const star = h('span', 'star');
		const size = Math.random() < .12 ? 2.4 : 1 + Math.random() * 1.1;
		star.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;--d:${(2.5 + Math.random() * 4).toFixed(1)}s;--dl:${(-Math.random() * 6).toFixed(1)}s`;
		sky.append(star);
	}

	let pw = 380;
	let ph = 528;
	let single = false;
	function measure() {
		const vw = innerWidth;
		const vh = innerHeight;
		const ratio = .72;
		const availableHeight = vh - 150;
		single = vw < 760 || vw / vh < 1.08;
		pw = single ? Math.min(vw - 56, availableHeight * ratio, 520) : Math.min((vw - 110) / 2, availableHeight * ratio, 560);
		pw = Math.max(150, Math.floor(pw));
		ph = Math.round(pw / ratio);
		const rootStyle = document.documentElement.style;
		rootStyle.setProperty('--pw', pw + 'px');
		rootStyle.setProperty('--ph', ph + 'px');
	}

	function fit() {
		const base = pw * .047;
		book.querySelectorAll('.pbw').forEach(wrapper => {
			const text = wrapper.firstElementChild;
			let fontSize = base;
			let attempts = 0;
			text.style.fontSize = fontSize + 'px';
			wrapper.style.overflowY = 'hidden';
			while (text.offsetHeight > wrapper.clientHeight + 1 && fontSize > 8 && attempts++ < 90) {
				fontSize -= .4;
				text.style.fontSize = fontSize + 'px';
			}
			if (text.offsetHeight > wrapper.clientHeight + 1) wrapper.style.overflowY = 'auto';
		});
	}

	const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
	const lerp = (a, b, t) => a + (b - a) * t;
	const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	const easeOut = t => 1 - Math.pow(1 - t, 3);
	let cur = 0;
	let side = 'R';
	let busy = false;
	const shiftFor = (c, currentSide) => c === 0 ? -.5 : c === N ? .5 : single ? (currentSide === 'R' ? -.5 : .5) : 0;

	function setLeaf(i, progress, moving) {
		const leaf = leaves[i];
		const bend = (i === 0 || i === N - 1) ? 0 : Math.sin(Math.PI * progress) * 1.3;
		leaf.p = progress;
		leaf.el.style.transform = `rotateY(${(-progress * 180).toFixed(2)}deg)` + (bend ? ` skewY(${(-bend).toFixed(2)}deg)` : '');
		leaf.el.style.zIndex = moving ? 100 : (progress >= .5 ? i + 1 : N - i);
		leaf.shF.style.opacity = progress < .5 ? Math.min(1, progress * 1.8) : 1;
		leaf.shB.style.opacity = progress > .5 ? Math.min(1, (1 - progress) * 1.8) : 0;
	}

	function aux(movingProgress) {
		let flipped = 0;
		for (let j = 1; j <= K; j++) flipped += leaves[j].p;
		edgeR.style.width = (7 * (K - flipped) / K).toFixed(1) + 'px';
		edgeL.style.width = (7 * flipped / K).toFixed(1) + 'px';
		const progress = movingProgress == null ? 0 : movingProgress;
		castR.style.opacity = (.85 * Math.sin(Math.PI * Math.pow(progress, .75))).toFixed(3);
		castL.style.opacity = (.85 * Math.sin(Math.PI * Math.pow(progress, 1.5))).toFixed(3);
	}

	function setShift(shift) {
		stage.style.transform = `translateX(${(shift * pw).toFixed(1)}px)`;
		floor.style.width = ((2 - 2 * Math.abs(shift)) * pw + 30).toFixed(0) + 'px';
	}

	function renderAll() {
		leaves.forEach((_, i) => setLeaf(i, i < cur ? 1 : 0, false));
		aux(null);
		setShift(shiftFor(cur, side));
	}

	function tween(duration, ease, fn) {
		return new Promise(resolve => {
			if (reduce) duration = 1;
			const start = performance.now();
			const step = time => {
				const progress = clamp((time - start) / duration, 0, 1);
				fn(ease(progress));
				if (progress < 1) requestAnimationFrame(step);
				else resolve();
			};
			requestAnimationFrame(step);
		});
	}

	async function flipLeaf(i, from, to, duration, ease, shiftStart, shiftEnd, forward) {
		await tween(duration, ease, progress => {
			const pageProgress = lerp(from, to, progress);
			setLeaf(i, pageProgress, true);
			aux(pageProgress);
			setShift(lerp(shiftStart, shiftEnd, forward ? pageProgress : 1 - pageProgress));
		});
		setLeaf(i, to, false);
		aux(null);
		setShift(Math.abs(to - (forward ? 1 : 0)) < .5 ? shiftEnd : shiftStart);
	}

	const slide = (start, end) => tween((single ? 900 : 1150) * .7, easeInOut, progress => setShift(lerp(start, end, progress)));

	async function turn(forward) {
		if (busy) return;
		const duration = single ? 900 : 1150;
		if (forward) {
			if (cur >= N) return;
			busy = true;
			if (single && side === 'L') {
				await slide(shiftFor(cur, 'L'), shiftFor(cur, 'R'));
				side = 'R';
			} else {
				await flipLeaf(cur, 0, 1, duration, easeInOut, shiftFor(cur, side), shiftFor(cur + 1, 'L'), true);
				cur++;
				side = 'L';
			}
		} else {
			if (cur <= 0) return;
			busy = true;
			if (single && side === 'R') {
				await slide(shiftFor(cur, 'R'), shiftFor(cur, 'L'));
				side = 'L';
			} else {
				await flipLeaf(cur - 1, 1, 0, duration, easeInOut, shiftFor(cur, side), shiftFor(cur - 1, 'R'), false);
				cur--;
				side = 'R';
			}
		}
		busy = false;
		hint.classList.add('off');
		ui();
	}

	const labelOf = page => !page ? '' : page.t === 'poem' ? String(page.i + 1) : page.t === 'title' ? 'Title' : page.t === 'end' ? 'Fin' : '';
	function ui() {
		const left = cur >= 2 && cur <= K + 1 ? labelOf(S[2 * cur - 3]) : '';
		const right = cur >= 1 && cur <= K ? labelOf(S[2 * cur - 2]) : '';
		const rightFirst = cur === 0 ? '' : (cur <= K ? labelOf(S[2 * cur - 2]) : '');
		let text;
		if (cur === 0) text = 'Cover';
		else if (cur === N) text = 'Back cover';
		else if (single) text = (side === 'L' ? left : rightFirst) || (side === 'L' && cur === 1 ? 'Inside cover' : cur === K + 1 && side === 'R' ? 'Inside cover' : '—');
		else text = [left, rightFirst].filter(Boolean).join('  ·  ') || '—';
		if (/\d/.test(text) && P.length) text += '  of ' + P.length;
		countEl.textContent = text.toUpperCase();
		btnPrev.disabled = cur === 0;
		btnNext.disabled = cur === N;
	}

	btnNext.addEventListener('click', () => turn(true));
	btnPrev.addEventListener('click', () => turn(false));
	addEventListener('keydown', event => {
		if (event.key === 'ArrowRight' || event.key === 'PageDown') {
			event.preventDefault();
			turn(true);
		} else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
			event.preventDefault();
			turn(false);
		}
	});

	let drag = null;
	scene.addEventListener('pointerdown', event => {
		if (busy || (event.pointerType === 'mouse' && event.button > 0)) return;
		drag = { x: event.clientX, dx: 0, vx: 0, px: event.clientX, pt: performance.now(), live: null };
	});

	addEventListener('pointermove', event => {
		if (!drag) return;
		const dx = event.clientX - drag.x;
		const now = performance.now();
		drag.vx = (event.clientX - drag.px) / Math.max(1, now - drag.pt);
		drag.px = event.clientX;
		drag.pt = now;
		drag.dx = dx;
		if (drag.live === null && Math.abs(dx) > 9) {
			const forward = dx < 0;
			const canDrag = !single && (forward ? cur < N : cur > 0);
			if (canDrag) {
				busy = true;
				scene.classList.add('dragging');
				drag.live = { fw: forward, li: forward ? cur : cur - 1, s0: shiftFor(cur, side), s1: shiftFor(forward ? cur + 1 : cur - 1, forward ? 'L' : 'R') };
			} else drag.live = false;
		}
		if (drag.live) {
			const live = drag.live;
			const distance = pw * 1.3;
			const progress = live.fw ? clamp(-dx / distance, 0, 1) : 1 - clamp(dx / distance, 0, 1);
			setLeaf(live.li, progress, true);
			aux(progress);
			setShift(lerp(live.s0, live.s1, live.fw ? progress : 1 - progress));
		}
	});

	async function endDrag(event, cancelled) {
		if (!drag) return;
		const currentDrag = drag;
		drag = null;
		scene.classList.remove('dragging');
		if (currentDrag.live) {
			const live = currentDrag.live;
			const progress = leaves[live.li].p;
			const velocity = currentDrag.vx;
			const target = cancelled ? (live.fw ? 0 : 1)
				: live.fw ? ((progress > .28 || velocity < -.45) ? 1 : 0) : ((progress < .72 || velocity > .45) ? 0 : 1);
			await flipLeaf(live.li, progress, target, clamp(Math.abs(target - progress) * 900 + 250, 250, 900), easeOut, live.s0, live.s1, live.fw);
			if ((live.fw && target === 1) || (!live.fw && target === 0)) {
				cur += live.fw ? 1 : -1;
				side = live.fw ? 'L' : 'R';
				hint.classList.add('off');
			}
			busy = false;
			ui();
			return;
		}
		if (cancelled || busy) return;
		if (Math.abs(currentDrag.dx) > 40) {
			turn(currentDrag.dx < 0);
			return;
		}
		if (Math.abs(currentDrag.dx) < 10) {
			let forward = single ? event.clientX > innerWidth * .33 : event.clientX > innerWidth / 2;
			if (cur === 0) forward = true;
			else if (cur === N) forward = false;
			turn(forward);
		}
	}

	addEventListener('pointerup', event => endDrag(event, false));
	addEventListener('pointercancel', event => endDrag(event, true));

	let resizeTimer;
	addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			measure();
			fit();
			setShift(shiftFor(cur, side));
		}, 120);
	});

	measure();
	renderAll();
	fit();
	ui();
	if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
