import { useState, useEffect, useRef, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

import SearchSection from '@/components/home/SearchSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturedJobsSection from '@/components/home/FeaturedJobsSection'
import FeaturedCompaniesSection from '@/components/home/FeaturedCompaniesSection'
import { useTheme } from '@/components/ThemeProvider'
import ChatIcon from '@/components/messaging/ChatIcon'

const HomePage = () => {
    const navigate = useNavigate()
    const { theme } = useTheme()
    const [searchKeyword, setSearchKeyword] = useState('')
    const [searchLocation, setSearchLocation] = useState('')
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const heroSectionRef = useRef<HTMLElement>(null)

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
        hover: {
            y: -5,
            transition: { duration: 0.2 },
        },
    }

    const [heroRef, heroInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const [searchRef, searchInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const [statsRef, statsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const [jobsRef, jobsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const [companiesRef, companiesInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroSectionRef.current) {
                const rect = heroSectionRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                setMousePosition({ x, y })
            }
        }

        const heroSection = heroSectionRef.current
        if (heroSection) {
            heroSection.addEventListener('mousemove', handleMouseMove)
        }

        return () => {
            if (heroSection) {
                heroSection.removeEventListener('mousemove', handleMouseMove)
            }
        }
    }, [])

    const handleSearch = (e: FormEvent) => {
        e.preventDefault()
        const searchParams = new URLSearchParams()
        if (searchKeyword) searchParams.append('keyword', searchKeyword)
        if (searchLocation) searchParams.append('location', searchLocation)

        const queryString = searchParams.toString()
        navigate(`/jobs${queryString ? `?${queryString}` : ''}`)
    }

    return (
        <div className="bg-jb-bg text-jb-text min-h-screen">
            {/* Hero Section */}
            <motion.section
                ref={(node) => {
                    heroRef(node)
                    if (node) heroSectionRef.current = node
                }}
                initial="hidden"
                animate={heroInView ? 'visible' : 'hidden'}
                variants={fadeIn}
                className="pt-16 md:!pt-24 pb-24 md:!pb-32 relative overflow-hidden"
                style={{
                    backgroundImage:
                        mousePosition.x > 0
                            ? `radial-gradient(
                circle 400px at ${mousePosition.x}px ${mousePosition.y}px,
                ${theme === 'dark' ? 'rgba(75, 85, 99, 0.25)' : 'rgba(243, 244, 246, 1)'} 0%,
                ${theme === 'dark' ? 'rgba(55, 65, 81, 0.15)' : 'rgba(243, 244, 246, 0.8)'} 30%,
                ${theme === 'dark' ? 'rgba(31, 41, 55, 0.08)' : 'rgba(243, 244, 246, 0.4)'} 50%,
                ${theme === 'dark' ? 'rgba(17, 24, 39, 0)' : 'rgba(243, 244, 246, 0)'} 65%
              )`
                            : undefined,
                }}
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <ChatIcon />
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.span
                            className="inline-block px-4 py-1.5 bg-jb-surface text-jb-text-muted rounded-full text-xs md:text-sm font-medium mb-6"
                            variants={fadeIn}
                        >
                            Over 10,000+ Jobs Available
                        </motion.span>

                        <motion.h1
                            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight text-jb-text"
                            variants={fadeIn}
                        >
                            Find Your{' '}
                            <span className="text-jb-primary">Dream Job</span>{' '}
                            Today
                        </motion.h1>

                        <motion.p
                            className="text-sm md:text-base text-jb-text-muted mb-8 leading-relaxed max-w-2xl mx-auto"
                            variants={fadeIn}
                        >
                            Join thousands of job seekers who have found their
                            perfect career match with our platform. Browse jobs
                            from top companies and start your career journey.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8"
                            variants={fadeIn}
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-jb-primary text-white hover:bg-jb-primary/90 font-medium transition-all duration-300 text-sm md:text-base shadow-sm"
                            >
                                <Link to="/jobs">Find Jobs</Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-jb-primary text-jb-primary hover:bg-jb-primary hover:text-white font-medium transition-all duration-300 text-sm md:text-base"
                            >
                                <Link to="/employer/jobs/create">
                                    Post a Job
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Sections */}
            <SearchSection
                searchRef={searchRef}
                searchInView={searchInView}
                fadeIn={fadeIn}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
                handleSearch={handleSearch}
            />

            <StatsSection
                statsRef={statsRef}
                statsInView={statsInView}
                fadeIn={fadeIn}
                staggerContainer={staggerContainer}
            />

            <FeaturedJobsSection
                jobsRef={jobsRef}
                jobsInView={jobsInView}
                fadeIn={fadeIn}
                staggerContainer={staggerContainer}
                cardVariants={cardVariants}
            />

            <FeaturedCompaniesSection
                companiesRef={companiesRef}
                companiesInView={companiesInView}
                fadeIn={fadeIn}
                staggerContainer={staggerContainer}
                cardVariants={cardVariants}
            />
        </div>
    )
}

export default HomePage
