// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { Building, Globe, Users, Trophy, ChevronRight } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import useFeaturedCompanies from '@/hooks/react-queries/company/useFeaturedCompanies';

// interface FeaturedCompaniesSectionProps {
//   companiesRef: React.RefCallback<HTMLElement>;
//   companiesInView: boolean;
//   fadeIn: any; // Animation variant
//   staggerContainer: any; // Animation variant
//   cardVariants: any; // Animation variant
// }

// const FeaturedCompaniesSection: React.FC<FeaturedCompaniesSectionProps> = ({
//   companiesRef,
//   companiesInView,
//   fadeIn,
//   staggerContainer,
//   cardVariants,
// }) => {
//   const { data: companiesData, isLoading } = useFeaturedCompanies();

//   const renderCompanies = () => {
//     if (isLoading) {
//       return Array(6).fill(0).map((_, index) => (
//         <motion.div
//           key={`skeleton-${index}`}
//           variants={cardVariants}
//           whileHover="hover"
//         >
//           <Card className="border-none shadow-sm h-full">
//             <CardContent className="p-4 flex flex-col items-center justify-center h-32">
//               <Skeleton className="w-16 h-16 rounded-md mb-2" />
//               <Skeleton className="h-4 w-24" />
//             </CardContent>
//           </Card>
//         </motion.div>
//       ));
//     }

//     if (!companiesData || companiesData.companies.length === 0) {
//       // Fallback to placeholder company cards if no data
//       return Array(6).fill(0).map((_, index) => (
//         <motion.div
//           key={`placeholder-${index}`}
//           variants={cardVariants}
//           whileHover="hover"
//         >
//           <Card className="border-none shadow-sm hover:bg-gray-50 h-full">
//             <CardContent className="p-4 flex flex-col items-center justify-center h-32">
//               <div className="w-16 h-16 bg-gradient-to-br from-jobboard-light to-jobboard-teal/30 rounded-md flex items-center justify-center mb-2 shadow-sm">
//                 {index % 3 === 0 && <Building className="w-6 h-6 md:w-8 md:h-8 text-jobboard-purple/70" />}
//                 {index % 3 === 1 && <Globe className="w-6 h-6 md:w-8 md:h-8 text-jobboard-purple/70" />}
//                 {index % 3 === 2 && <Users className="w-6 h-6 md:w-8 md:h-8 text-jobboard-purple/70" />}
//               </div>
//               <p className="text-sm font-medium text-gray-700">Company {index + 1}</p>
//             </CardContent>
//           </Card>
//         </motion.div>
//       ));
//     }

//     // Render actual company data
//     return companiesData.companies.map((company) => {
//       const industryIcons: { [key: string]: React.ReactNode } = {
//         'Technology': <Globe className="w-6 h-6 md:w-8 md:h-8 text-jobboard-purple/70" />,
//         'Finance': <Trophy className="w-6 h-6 md:w-8 md:h-8 text-jobboard-purple/70" />,
//         'Healthcare': <Users className="w-6 h-6 md:w-8 md:h-8 text-jobboard-purple/70" />,
//         'default': <Building className="w-6 h-6 md:w-8 md:h-8 text-jobboard-purple/70" />
//       };

//       const industryIcon = industryIcons[company.industry] || industryIcons.default;

//       return (
//         <motion.div
//           key={company.id}
//           variants={cardVariants}
//           whileHover="hover"
//         >
//           <Link to={`/companies/${company.id}`} className="block h-full">
//             <Card className="border-none shadow-sm hover:bg-gray-50 h-full">
//               <CardContent className="p-4 flex flex-col items-center justify-center h-32">
//                 {company.logo ? (
//                   <img
//                     src={company.logo}
//                     alt={company.name}
//                     className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-md mb-2 shadow-sm"
//                   />
//                 ) : (
//                   <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-jobboard-light to-jobboard-teal/30 rounded-md flex items-center justify-center mb-2 shadow-sm">
//                     {industryIcon}
//                   </div>
//                 )}
//                 <p className="text-xs md:text-sm font-medium text-gray-700 text-center line-clamp-1">{company.name}</p>
//                 <p className="text-xs text-gray-500 hidden md:block">{company.industry}</p>
//               </CardContent>
//             </Card>
//           </Link>
//         </motion.div>
//       );
//     });
//   };

//   return (
//     <motion.section
//       ref={companiesRef}
//       initial="hidden"
//       animate={companiesInView ? "visible" : "hidden"}
//       variants={fadeIn}
//       className="py-12"
//     >
//       <div className="container mx-auto px-4 sm:px-6">
//         <div className="text-center mb-12">
//           <motion.h2
//             className="text-2xl font-bold mb-4 inline-block relative"
//             variants={fadeIn}
//           >
//             Featured Companies
//             <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-jb-primary"></span>
//           </motion.h2>
//           <motion.p
//             className="text-gray-600 max-w-2xl mx-auto mt-4"
//             variants={fadeIn}
//           >
//             Discover top companies that are currently hiring and find your perfect match.
//           </motion.p>
//         </div>

//         <motion.div
//           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
//           variants={staggerContainer}
//         >
//           {renderCompanies()}
//         </motion.div>

//         <div className="mt-8 text-center">
//           <Button
//             asChild
//             variant="outline"
//             className="border-jobboard-purple text-jobboard-purple hover:bg-[#836FFF] hover:text-white transition-all duration-300"
//           >
//             <Link to="/companies" className="inline-flex items-center">
//               View All Companies
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </motion.section>
//   );
// };

// export default FeaturedCompaniesSection;

import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building, Globe, Users, Trophy, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useFeaturedCompanies from '@/hooks/react-queries/company/useFeaturedCompanies'

interface FeaturedCompaniesSectionProps {
    companiesRef: React.RefCallback<HTMLElement>
    companiesInView: boolean
    fadeIn: any
    staggerContainer: any
    cardVariants: any
}

const FeaturedCompaniesSection: React.FC<FeaturedCompaniesSectionProps> = ({
    companiesRef,
    companiesInView,
    fadeIn,
    staggerContainer,
    cardVariants,
}) => {
    const { data: companiesData, isLoading } = useFeaturedCompanies()

    const renderCompanies = () => {
        if (isLoading) {
            return Array(6)
                .fill(0)
                .map((_, index) => (
                    <motion.div
                        key={`skeleton-${index}`}
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <Card className="border-none shadow-sm h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                                <Skeleton className="w-16 h-16 rounded-md mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))
        }

        if (!companiesData || companiesData.companies.length === 0) {
            return Array(6)
                .fill(0)
                .map((_, index) => (
                    <motion.div
                        key={`placeholder-${index}`}
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <Card className="border-none shadow-sm hover:bg-jb-surface h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                                <div className="w-16 h-16 bg-gradient-to-br from-jb-bg to-jb-success/30 rounded-md flex items-center justify-center mb-2 shadow-sm">
                                    {index % 3 === 0 && (
                                        <Building className="w-6 h-6 md:w-8 md:h-8 text-jb-primary/70" />
                                    )}
                                    {index % 3 === 1 && (
                                        <Globe className="w-6 h-6 md:w-8 md:h-8 text-jb-primary/70" />
                                    )}
                                    {index % 3 === 2 && (
                                        <Users className="w-6 h-6 md:w-8 md:h-8 text-jb-primary/70" />
                                    )}
                                </div>
                                <p className="text-sm font-medium text-jb-text">
                                    Company {index + 1}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))
        }

        return companiesData.companies.map((company) => {
            const industryIcons: { [key: string]: React.ReactNode } = {
                Technology: (
                    <Globe className="w-6 h-6 md:w-8 md:h-8 text-jb-primary/70" />
                ),
                Finance: (
                    <Trophy className="w-6 h-6 md:w-8 md:h-8 text-jb-primary/70" />
                ),
                Healthcare: (
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-jb-primary/70" />
                ),
                default: (
                    <Building className="w-6 h-6 md:w-8 md:h-8 text-jb-primary/70" />
                ),
            }

            const industryIcon =
                industryIcons[company.industry] || industryIcons.default

            return (
                <motion.div
                    key={company.id}
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <Link
                        to={`/companies/${company.id}`}
                        className="block h-full"
                    >
                        <Card className="border-none shadow-sm hover:bg-jb-surface h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                                {company.logo ? (
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-md mb-2 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-jb-bg to-jb-success/30 rounded-md flex items-center justify-center mb-2 shadow-sm">
                                        {industryIcon}
                                    </div>
                                )}
                                <p className="text-xs md:text-sm font-medium text-jb-text text-center line-clamp-1">
                                    {company.name}
                                </p>
                                <p className="text-xs text-jb-text-muted hidden md:block">
                                    {company.industry}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            )
        })
    }

    return (
        <motion.section
            ref={companiesRef}
            initial="hidden"
            animate={companiesInView ? 'visible' : 'hidden'}
            variants={fadeIn}
            className="py-12"
        >
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <motion.h2
                        className="text-2xl font-bold mb-4 inline-block relative"
                        variants={fadeIn}
                    >
                        Featured Companies
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-jb-primary"></span>
                    </motion.h2>
                    <motion.p
                        className="text-jb-text-muted max-w-2xl mx-auto mt-4"
                        variants={fadeIn}
                    >
                        Discover top companies that are currently hiring and
                        find your perfect match.
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                    variants={staggerContainer}
                >
                    {renderCompanies()}
                </motion.div>

                <div className="mt-8 text-center">
                    <Button
                        asChild
                        variant="outline"
                        className="border-jb-primary text-jb-primary hover:bg-jb-primary hover:text-white transition-all duration-300"
                    >
                        <Link
                            to="/companies"
                            className="inline-flex items-center"
                        >
                            View All Companies
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}

export default FeaturedCompaniesSection
