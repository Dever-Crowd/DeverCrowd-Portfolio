"use client";
import H1 from "@/components/ui/H1";
import P from "@/components/ui/P";
import { useAdmins } from "@/hooks/useAdmins";
import ProfileCard from '../ProfileCard'

const OurStack = () => {
    const { data: admins = [] } = useAdmins();
    return (
        <section
            id="our-team"
            className="relative min-h-screen flex w-full flex-col items-center justify-center py-16 px-4 sm:px-16 bg-section gap-6 overflow-hidden"
        >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-96 rounded-full bg-white/5 blur-3xl opacity-90 pointer-events-none z-0" />
            <H1>The Team Behind the Work</H1>
            <P variant="muted" className="max-w-2xl text-center mb-2">
                Every project is built on a foundation of modern, battle-tested technologies — chosen for performance, scalability, and long-term maintainability.
            </P>
            <div className="flex flex-wrap relative items-center justify-center w-full gap-5">
                {admins.map((admin) => {
                    return (
                        <ProfileCard
                            key={admin._id}
                            name={admin.nickname}
                            title={admin.role}
                            handle={admin.username}
                            status="Online"
                            contactText="Contact Me"
                            avatarUrl={admin.pic}
                            showUserInfo={true}
                            enableTilt={true}
                            enableMobileTilt={true}
                            onContactClick={() => console.log('Contact clicked')}
                            behindGlowColor=""
                            iconUrl="/icons/code.png"
                            behindGlowEnabled
                            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                            behindGlowSize="50%"
                            miniAvatarUrl={admin.pic}
                        />
                    )
                })}
            </div>
        </section>
    );
};

export default OurStack;