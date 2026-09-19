(() => {
    /* NATURE — Immersive Wild Organic
       GSAP scroll animations + custom cursor + 3D tilt */

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const isDesktop = window.innerWidth > 900 && matchMedia('(pointer: fine)').matches;

    /* ---- Lenis Smooth Scroll ---- */
    let lenis;
    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    /* ---- Entrance Timeline ---- */
    const master = gsap.timeline({ delay: 0.15 });

    /* ---- Hero Entrance ---- */
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
        const heroMedia = hero.querySelector('.hero__media');
        const heroContent = hero.querySelector('.hero__content');
        const heroVignette = hero.querySelector('.hero__vignette');

        /* Cinematic zoom-out reveal */
        if (heroMedia) {
            master.from(heroMedia, { scale: 1.25, duration: 2.2, ease: 'power3.out' }, 0);
        }

        /* Vignette intensity animation */
        if (heroVignette) {
            master.fromTo(heroVignette,
                { opacity: 1.4 },
                { opacity: 1, duration: 2, ease: 'power2.out' },
                0
            );
        }

        /* Word-by-word title animation */
        const heroTitle = hero.querySelector('.hero__title');
        if (heroTitle) {
            const raw = heroTitle.textContent.trim();
            heroTitle.innerHTML = raw.split(/\s+/).map(w =>
                `<span class="word"><span class="word__inner">${w}</span></span>`
            ).join(' ');
            master.from('.hero__title .word__inner', {
                yPercent: 120, duration: 1.1, stagger: 0.07, ease: 'power4.out'
            }, '-=1.6');
        }

        /* Stagger remaining hero elements */
        if (heroContent) {
            const els = [...heroContent.children].filter(
                el => !el.classList.contains('hero__title')
            );
            if (els.length) {
                master.from(els, {
                    y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out'
                }, '-=1.2');
            }
        }

        const heroScroll = hero.querySelector('.hero__scroll');
        if (heroScroll) {
            master.from(heroScroll, { opacity: 0, duration: 1 }, '-=0.3');
        }
    }

    /* ---- Subpage Hero Entrance ---- */
    const pageHero = document.querySelector('.page-hero');
    if (pageHero && !prefersReducedMotion) {
        const content = pageHero.querySelector('.page-hero__content');
        if (content) {
            master.from([...content.children], {
                y: 30, opacity: 0, duration: .8, stagger: 0.08, ease: 'power3.out'
            }, 0);
        }
    }

    /* ---- Hero Parallax on Scroll ---- */
    if (!prefersReducedMotion && hero) {
        const heroMedia = hero.querySelector('.hero__media');
        if (heroMedia) {
            gsap.to(heroMedia, {
                scale: 1.12, ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
            });
        }
        const heroContent = hero.querySelector('.hero__content');
        if (heroContent) {
            gsap.to(heroContent, {
                yPercent: -25, opacity: 0, ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: '55% top', scrub: 1 }
            });
        }
    }

    /* ---- Data-Reveal Animations ---- */
    if (!prefersReducedMotion) {
        document.querySelectorAll('[data-reveal]').forEach(el => {
            const delay = parseFloat(el.dataset.delay) || 0;
            const hasImage = el.querySelector('img') || el.tagName === 'IMG' ||
                el.classList.contains('intro__image') ||
                el.classList.contains('room-card') ||
                el.classList.contains('gallery-grid__item');

            if (hasImage) {
                /* Wipe-reveal from bottom */
                gsap.fromTo(el,
                    { clipPath: 'inset(100% 0 0 0)' },
                    {
                        clipPath: 'inset(0% 0 0 0)', duration: 1.3, delay,
                        ease: 'power4.inOut',
                        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
                    }
                );
                /* Zoom settle */
                const img = el.querySelector('img');
                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.15 },
                        {
                            scale: 1, duration: 1.8, delay,
                            ease: 'power3.out',
                            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
                        }
                    );
                }
            } else {
                /* Standard fade + slide for text */
                gsap.from(el, {
                    y: 30, opacity: 0, duration: 0.8, delay,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
                });
            }
        });
    }

    /* ---- Intro Image — Slide from Left with Organic Shape ---- */
    if (!prefersReducedMotion) {
        const introImage = document.querySelector('.intro__image');
        if (introImage) {
            gsap.fromTo(introImage,
                { x: -80, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: introImage, start: 'top 85%', once: true }
                }
            );
            /* Animate organic border-radius */
            const introImg = introImage.querySelector('img');
            if (introImg) {
                gsap.fromTo(introImg,
                    { borderRadius: '0 200px 0 200px' },
                    {
                        borderRadius: '0 120px 0 120px', duration: 1.5,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: introImage, start: 'top 85%', once: true }
                    }
                );
            }
        }
    }

    /* ---- Staggered Card Animations ---- */
    if (!prefersReducedMotion) {
        /* Activity cards */
        const activityCards = document.querySelectorAll('.activity-card');
        if (activityCards.length > 0) {
            gsap.from(activityCards, {
                y: 60, opacity: 0, duration: 0.8,
                stagger: { each: 0.08, from: 'start' },
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: activityCards[0].parentElement,
                    start: 'top 80%',
                    once: true
                }
            });
        }

        /* Stats items */
        const statsItems = document.querySelectorAll('.stats__item');
        if (statsItems.length > 0) {
            gsap.from(statsItems, {
                y: 50, opacity: 0, duration: 0.9,
                stagger: { each: 0.12, from: 'start' },
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: statsItems[0].parentElement,
                    start: 'top 80%',
                    once: true
                }
            });
        }

        /* Room cards */
        const roomCards = document.querySelectorAll('.room-card');
        if (roomCards.length > 0) {
            gsap.from(roomCards, {
                y: 60, opacity: 0, duration: 0.9,
                stagger: { each: 0.15, from: 'start' },
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: roomCards[0].parentElement,
                    start: 'top 80%',
                    once: true
                }
            });
        }

        /* Contact strip items */
        const contactItems = document.querySelectorAll('.contact-strip__item');
        if (contactItems.length > 0) {
            gsap.from(contactItems, {
                y: 30, opacity: 0, duration: 0.8,
                stagger: { each: 0.08, from: 'start' },
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: contactItems[0].parentElement,
                    start: 'top 85%',
                    once: true
                }
            });
        }

        /* Gallery grid items — clip-path reveal */
        const galleryItems = document.querySelectorAll('.gallery-grid__item');
        if (galleryItems.length > 0) {
            gsap.from(galleryItems, {
                clipPath: 'inset(0 0 100% 0)', opacity: 0, duration: 1,
                stagger: { each: 0.1, from: 'start' },
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: galleryItems[0].parentElement,
                    start: 'top 80%',
                    once: true
                }
            });
        }
    }

    /* ---- Parallax Backgrounds ---- */
    if (!prefersReducedMotion) {
        document.querySelectorAll('[data-parallax-bg]').forEach(el => {
            gsap.to(el, {
                yPercent: -15, ease: 'none',
                scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
            });
        });
    }

    /* ---- Nature Break Parallax ---- */
    if (!prefersReducedMotion) {
        const natureBreak = document.querySelector('.nature-break');
        if (natureBreak) {
            const nbContent = natureBreak.querySelector('.nature-break__content');
            if (nbContent) {
                gsap.fromTo(nbContent,
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                        scrollTrigger: { trigger: natureBreak, start: 'top 70%', once: true }
                    }
                );
            }
            const nbImg = natureBreak.querySelector('.nature-break__img');
            if (nbImg) {
                gsap.to(nbImg, {
                    yPercent: -15, ease: 'none',
                    scrollTrigger: {
                        trigger: natureBreak,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2
                    }
                });
            }
        }
    }

    /* ---- Custom Cursor (DESKTOP ONLY) ---- */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower && !prefersReducedMotion && isDesktop) {
        let cx = -100, cy = -100;

        document.addEventListener('mousemove', e => {
            cx = e.clientX;
            cy = e.clientY;
            gsap.to(cursor, { x: cx, y: cy, duration: 0.1, ease: 'power2.out' });
            gsap.to(follower, { x: cx, y: cy, duration: 0.35, ease: 'power3.out' });
        });

        document.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-visible');
            follower.classList.add('cursor-visible');
        });
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-visible');
            follower.classList.remove('cursor-visible');
        });

        /* Hover states — follower scales to 1.5x */
        document.querySelectorAll('a, button, [data-magnetic], .room-card, .gallery-grid__item, .gallery__item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--hover');
                follower.classList.add('cursor-follower--hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--hover');
                follower.classList.remove('cursor-follower--hover');
            });
        });

        /* Click: cursor shrinks momentarily */
        document.addEventListener('mousedown', () => cursor.classList.add('cursor--active'));
        document.addEventListener('mouseup', () => cursor.classList.remove('cursor--active'));
    }

    /* ---- 3D Tilt on Room Cards (DESKTOP ONLY) ---- */
    if (!prefersReducedMotion && isDesktop) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            const img = card.querySelector('.room-card__image');
            if (!img) return;

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                /* Limit to +/-8 degrees */
                gsap.to(img, {
                    rotateY: x * 8,
                    rotateX: -y * 8,
                    duration: 0.1,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                /* Elastic ease back to 0 */
                gsap.to(img, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    /* ---- Magnetic Buttons (DESKTOP ONLY) ---- */
    if (!prefersReducedMotion && isDesktop) {
        document.querySelectorAll('[data-magnetic]').forEach(btn => {
            const strength = parseFloat(btn.dataset.magnetic) || 0.3;
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    /* ---- Marquee (scroll-velocity responsive) ---- */
    const marqueeInner = document.querySelector('.marquee__inner');
    if (marqueeInner && !prefersReducedMotion) {
        marqueeInner.innerHTML += marqueeInner.innerHTML;
        const marqueeTween = gsap.to(marqueeInner, { xPercent: -50, duration: 35, ease: 'none', repeat: -1 });

        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: self => {
                const v = Math.abs(self.getVelocity());
                if (v > 50) {
                    gsap.to(marqueeTween, { timeScale: gsap.utils.clamp(1, 5, 1 + v / 800), duration: 0.3, overwrite: true });
                } else {
                    gsap.to(marqueeTween, { timeScale: 1, duration: 0.8, overwrite: true });
                }
            }
        });
    }

    /* ---- Scroll Progress Bar ---- */
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        gsap.to(progressBar, {
            scaleX: 1, ease: 'none',
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
        });
    }

    /* ---- Counter Animation ---- */
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals) || 0;
        ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
                if (prefersReducedMotion) { el.textContent = target.toFixed(decimals); return; }
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target, duration: 2.5, ease: 'power2.out',
                    onUpdate: () => el.textContent = obj.val.toFixed(decimals)
                });
            }
        });
    });

    /* ---- Horizontal Scroll Gallery (subpages) ---- */
    const hscroll = document.querySelector('.hscroll');
    if (hscroll && !prefersReducedMotion) {
        const track = hscroll.querySelector('.hscroll__track');
        const panels = hscroll.querySelectorAll('.hscroll__panel');
        if (track && panels.length > 1) {
            const hscrollTween = gsap.to(track, {
                x: () => -(track.scrollWidth - hscroll.offsetWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: hscroll,
                    start: 'top top',
                    end: () => '+=' + (track.scrollWidth - hscroll.offsetWidth),
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
            panels.forEach(panel => {
                const img = panel.querySelector('img');
                if (img) {
                    gsap.fromTo(img, { xPercent: -8 }, {
                        xPercent: 8, ease: 'none',
                        scrollTrigger: { trigger: panel, start: 'left right', end: 'right left', scrub: true, containerAnimation: hscrollTween }
                    });
                }
            });
        }
    }

    /* ---- Nav ---- */
    const nav = document.getElementById('nav');
    if (nav && !nav.classList.contains('nav--solid')) {
        ScrollTrigger.create({
            start: 80,
            onUpdate: self => nav.classList.toggle('nav--scrolled', self.scroll() > 80)
        });
    }

    /* ---- Mobile Menu — Fullscreen Overlay ---- */
    const toggle = document.querySelector('.nav__toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinksEl = document.querySelector('.nav__links');
    if (toggle && navOverlay) {
        toggle.addEventListener('click', () => {
            const isOpen = navOverlay.classList.contains('open');
            toggle.classList.toggle('active');
            navOverlay.classList.toggle('open');

            if (!isOpen) {
                /* Animate overlay links in */
                const links = navOverlay.querySelectorAll('.nav__overlay-link');
                if (links.length && !prefersReducedMotion) {
                    gsap.from(links, {
                        y: 30, opacity: 0, duration: 0.5,
                        stagger: 0.06, ease: 'power3.out', delay: 0.15
                    });
                }
                if (lenis) lenis.stop();
            } else {
                if (lenis) lenis.start();
            }
        });

        /* Close on link click */
        navOverlay.querySelectorAll('.nav__overlay-link').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                navOverlay.classList.remove('open');
                if (lenis) lenis.start();
            });
        });
    }
    /* Desktop nav link clicks */
    if (navLinksEl) {
        navLinksEl.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                if (toggle) toggle.classList.remove('active');
                if (navOverlay) navOverlay.classList.remove('open');
                if (lenis) lenis.start();
            });
        });
    }

    /* ---- Sticky Bar ---- */
    const stickyBar = document.getElementById('sticky-bar');
    if (stickyBar) {
        const heroEl = document.querySelector('.hero, .page-hero');
        const triggerPoint = heroEl ? heroEl.offsetHeight : 600;
        ScrollTrigger.create({
            start: triggerPoint,
            onUpdate: self => stickyBar.classList.toggle('sticky-bar--visible', self.scroll() > triggerPoint)
        });
    }

    /* ---- Lightbox (gallery subpage) ---- */
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lbImg = lightbox.querySelector('.lightbox__img');
        const btnClose = lightbox.querySelector('.lightbox__close');
        const btnPrev = lightbox.querySelector('.lightbox__prev');
        const btnNext = lightbox.querySelector('.lightbox__next');
        const elCurrent = document.getElementById('lb-current');
        const elTotal = document.getElementById('lb-total');
        let items = [], current = 0;

        function open(i) {
            current = i; lbImg.src = items[current].src;
            if (elCurrent) elCurrent.textContent = current + 1;
            if (elTotal) elTotal.textContent = items.length;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }
        function close() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }
        function prev() { current = (current - 1 + items.length) % items.length; lbImg.src = items[current].src; if (elCurrent) elCurrent.textContent = current + 1; }
        function next() { current = (current + 1) % items.length; lbImg.src = items[current].src; if (elCurrent) elCurrent.textContent = current + 1; }

        document.querySelectorAll('.gallery__item img').forEach((image, i) => {
            items.push(image);
            image.addEventListener('click', () => open(i));
        });

        if (btnClose) btnClose.addEventListener('click', close);
        if (btnPrev) btnPrev.addEventListener('click', prev);
        if (btnNext) btnNext.addEventListener('click', next);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

        let touchStartX = 0;
        lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });
    }

})();
