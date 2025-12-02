import { Profile } from '@/types/profile'
import { motion } from 'framer-motion'

import BasicInfoSection from './BasicInfoSection'
import EducationSection from './EducationSection'
import ExperienceSection from './ExperienceSection'
import LinksResumeSection from './LinksResumeSection'

interface ProfileTabsProps {
    profile: Profile
}

const ProfileTabs = ({ profile }: ProfileTabsProps) => {
    // Animation variants for stagger effect
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Overview Section */}
            <motion.div variants={itemVariants}>
                <BasicInfoSection profile={profile} />
            </motion.div>

            {/* Education Section */}
            <motion.div variants={itemVariants}>
                <EducationSection education={profile.education} />
            </motion.div>

            {/* Experience Section */}
            <motion.div variants={itemVariants}>
                <ExperienceSection experience={profile.experience} />
            </motion.div>

            {/* Links & Resume Section */}
            <motion.div variants={itemVariants}>
                <LinksResumeSection
                    linkedInUrl={profile.linkedInUrl}
                    githubUrl={profile.githubUrl}
                    portfolioUrl={profile.portfolioUrl}
                    resume={profile.resume}
                />
            </motion.div>
        </motion.div>
    )
}

export default ProfileTabs
