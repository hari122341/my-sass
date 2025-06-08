"use client"
import { getSubjectColor, cn } from '@/lib/utils'
import React, { useState, useEffect, useRef } from 'react'

enum CallStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    CONNECTING = 'CONNECTING',
    FINISHED = 'FINISHED',
}
import soundwaves from '@/constants/soundwaves.json';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { configureAssistant } from '@/lib/utils';
import { MessagesSquare } from 'lucide-react';
import { addToSessionHistory } from '@/lib/actions/companion.actions';
const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        }
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }
        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage =
                {
                    role: message.role,
                    content: message.transcript,

                }
                setMessages((prev) => [newMessage, ...prev])
            }


        }
        const onSpeechEnd = () => {
            setIsSpeaking(false);
        }
        const onSpeechStart = () => {
            setIsSpeaking(true);
        }

        const onError = (error: Error) => {
            console.error("Error during call:", error);
        }

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        const onCallConnecting = () => {
            setCallStatus(CallStatus.CONNECTING);
        }

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);

        }
    }, []);
    const lottiRef = useRef<LottieRefCurrentProps>(null);
    useEffect(() => {
        if (lottiRef) {
            if (isSpeaking) {
                lottiRef.current?.play();
            } else {
                lottiRef.current?.stop();

            }
        }


    }, [isSpeaking, lottiRef])
    const [isMuted, setisMuted] = useState(false);
    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        console.log('Microphone is muted:', isMuted);
        vapi.setMuted(!isMuted);
        setisMuted(!isMuted);
    }
    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        try {
            const assistantOverrides = {
                variableValues: {
                    subject, topic, style: style || 'formal'
                },
                clientMessages: ['transcript'],
                serverMessages: [],


            }

            // @ts-expect-error
            await vapi.start(configureAssistant(voice || 'sarah', style || 'formal'), assistantOverrides)
        } catch (error) {
            console.error("Error starting call:", error);
        }

    }
    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();

    }

    return (
        <section className='flex flex-col h-[70vh]'>
            <section className='flex gap-8 max-sm:flex-col '>
                <div className='companion-section'>
                    <div className='companion-avatar' style={{ backgroundColor: getSubjectColor(subject) }}>
                        <div className={
                            cn('absolute transition-opacity duration-1000',
                                callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001' : 'opacity-0',
                                callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'

                            )
                        }>
                            <Image
                                src={`../../icons/${subject}.svg`}
                                alt={`${subject} subject icon`}
                                width={150}
                                height={150}
                                className='max-sm:w-fit'
                            />

                        </div>
                        <div
                            className={
                                cn('absolute transition-opacity duration-1000',
                                    callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
                                )
                            }
                        >
                            <Lottie
                                lottieRef={lottiRef}
                                animationData={soundwaves}
                                // loop={true}
                                autoplay={false}
                                className="companion-lottie"

                            />

                        </div>

                    </div>
                    <p

                        className='font-bold text-2xl'>
                        {name}

                    </p>

                </div>
                <div className='user-section'>
                    <div className='user-avatar'>
                        {/* {userImage} */}
                        <Image
                            src={userImage}
                            alt={`${userName}'s profile picture`}
                            width={130}
                            height={130}
                            className='rounded-lg'

                        />
                        <p className='font-bold text-2xl'>
                            {userName}

                        </p>
                    </div>
                    <button className='btn-mic' onClick={toggleMicrophone}
                        disabled={callStatus !== CallStatus.ACTIVE} >
                        <Image
                            src={isMuted ? `../../icons/mic-off.svg` : `../../icons/mic-on.svg`}
                            alt="mic"
                            width={36}
                            height={36}
                        />
                        {
                            isMuted ? 'Turn on microphone' : ' Turn off microphone'
                        }

                    </button>
                    <button
                        className={
                            cn(
                                'rounded-lg py-2 cursor-pointed transition-colors w-full text-white',
                                callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
                                callStatus === CallStatus.CONNECTING && 'animate-pulse',
                            )
                        }
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
                        {
                            callStatus === CallStatus.ACTIVE
                                ? "End Session"
                                : callStatus === CallStatus.CONNECTING
                                    ? 'Connecting...'
                                    : 'Start Session'
                        }

                    </button>

                </div>

            </section>

            <section className='transcript'>
                <div className='transcript-message no-scrollbar'>
                    {
                        messages.map(
                            (message, index) => {
                                if (message.role === 'assistant') {
                                    return (
                                        <p
                                            key={index}
                                            className='max-sm:text-sm'>
                                            {
                                                name
                                                    .split(' ')[0]
                                                    .replace('/[.,]/g, ', '')
                                            } : {index}


                                        </p>
                                    )
                                } else {
                                    return <p
                                        key={index}
                                        className='text-primary max-sm:text-sm'

                                    >
                                        {userName}:{index}

                                    </p>
                                }

                            }
                        )
                    }
                </div>

                <div className='transcript-fade' />




            </section>

        </section >


    )

}

export default CompanionComponent