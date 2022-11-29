import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { gsap } from 'gsap'

export default function Home() {

	gsap.registerPlugin(ScrollTrigger)

	const lenis = useRef(null)

	const update = (time, deltaTime, frame) => {
		// console.log(time)
		lenis.current.raf(time * 1000)
	}

	useEffect(() => {

		lenis.current = new Lenis({
			duration: .7,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
			infinite: false,
		})

		lenis.current.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
			// console.log({ scroll, limit, velocity, direction, progress })
			ScrollTrigger.update()
		})

		gsap.ticker.add(update)

		ScrollTrigger.scrollerProxy(document.body, {
			scrollTop(value) {
				if (arguments.length) {
					lenis.current.scroll = value
				}
				return lenis.current.scroll
			},
			getBoundingClientRect() {
				return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
			}
		})

		ScrollTrigger.defaults({ scroller: document.body })

		window.addEventListener('resize', e => {
			// console.log(lenis.current)
			ScrollTrigger.refresh()
		})

		// animations

		const section1 = document.body.querySelector('.section-1')
		const box = document.body.querySelector('.box')

		const tl = gsap.timeline({ paused: true })

		tl.fromTo(box, { y: 0 }, { y: '100vh', duration: 1, ease: 'none' }, 0)

		const st = ScrollTrigger.create({
			animation: tl,
			trigger: section1,
			start: 'top top',
			end: 'bottom top',
			scrub: true
		})

		return () => {
			gsap.ticker.remove(update)
			lenis.current.destroy()
			tl.kill()
			st.kill()
		}

	}, [])


	return (
		<div className="container">
			<section className="section section-1">
				<div className="box">
					<div className="text">Resize when the page was scrolled make me jump :/</div>
				</div>
			</section>
			<section className="section section-2"></section>
			<section className="section section-3"></section>
		</div>
	)
}
