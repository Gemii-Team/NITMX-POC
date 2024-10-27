import { useState } from 'react';
import Typewriter from 'typewriter-effect';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/welcome');
}
