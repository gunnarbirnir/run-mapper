import { motion } from 'framer-motion';
import { useState } from 'react';

import { Text, Button, Icon } from '~/primitives';
import { DEFAULT_EASING } from '~/constants';
import { PageLayout } from '~/components/PageLayout';
import { ShaderBackground } from '~/components/ShaderBackground';
import { useAuthState } from '~/hooks/useAuthState';

const FADE_IN_DURATION = 0.25;
const FADE_IN_DISTANCE = 20;
const FADE_IN_STAGGER = 0.1;

export function Home() {
  const { user } = useAuthState();
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);
  let fadeInStagger = 1;

  return (
    <PageLayout>
      <main className="flex-1">
        <div className="flex justify-center px-6 pt-12 pb-10">
          <div className="max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: FADE_IN_DISTANCE }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: FADE_IN_DURATION,
                ease: DEFAULT_EASING,
                delay: fadeInStagger++ * FADE_IN_STAGGER,
              }}
            >
              <Text element="h1" className="text-center text-5xl">
                Spretta
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: FADE_IN_DISTANCE }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: FADE_IN_DURATION,
                ease: DEFAULT_EASING,
                delay: fadeInStagger++ * FADE_IN_STAGGER,
              }}
              onAnimationComplete={() => setInitialAnimationComplete(true)}
            >
              <Text variant="subtle" className="text-lg">
                Turn your race route into a beautiful, interactive map that
                runners can explore before race day. Then embed it on your event
                page in seconds.
              </Text>
            </motion.div>
          </div>
        </div>
        <div className="relative h-50 w-dvw overflow-hidden">
          <div className="h-[300%] w-full -translate-y-1/3 bg-gray-50">
            <ShaderBackground className="h-full w-full" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: FADE_IN_DISTANCE }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: FADE_IN_DURATION,
              ease: DEFAULT_EASING,
              delay: fadeInStagger * FADE_IN_STAGGER,
            }}
            onAnimationComplete={() => setInitialAnimationComplete(true)}
            className="last absolute top-10 flex w-full justify-center"
          >
            <Button linkTo={user ? '/runs' : '/auth/signup'}>
              Get started for free
              <Icon name="arrow" className="size-5 rotate-90" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{
              duration: 1,
              ease: DEFAULT_EASING,
              delay: fadeInStagger * FADE_IN_STAGGER,
            }}
            className="pointer-events-none absolute inset-0 bg-white"
          />
        </div>
        <div className="-mb-8 px-6">
          <div className="container mx-auto -translate-y-20">
            {initialAnimationComplete && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: FADE_IN_DISTANCE }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: FADE_IN_DURATION,
                    ease: DEFAULT_EASING,
                  }}
                  className="h-175 w-full bg-gray-50 shadow-lg"
                >
                  <iframe
                    src={`${import.meta.env.VITE_FRONTEND_BASE_URL}/run/nesvegur-10k`}
                    id="spretta-nesvegur-10k"
                    title="Spretta - Nesvegur 10k"
                    className="h-full w-full"
                  ></iframe>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: FADE_IN_DURATION,
                    ease: DEFAULT_EASING,
                    // Starts when iframe has animated in
                    delay: FADE_IN_DURATION,
                  }}
                >
                  <Text variant="subtle" className="mt-4 text-sm">
                    This is a demo of the embedded map
                  </Text>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
