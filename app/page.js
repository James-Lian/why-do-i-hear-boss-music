import Image from "next/image";
import SpeechToText from "./components/speechrecognition";

export default function Home() {
  return (
    <div className="bg-stone-100 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <SpeechToText />
        
        <div className="flex gap-4 items-center flex-col sm:flex-row italic text-center mx-auto">
          James Lian & Andrew Wu
        </div>

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/James-Lian"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="James' Github"
            width={16}
            height={16}
          />
          James' Github
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/andrew-wu-845a142a9/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Andrew's LinkedIn"
            width={16}
            height={16}
          />
          Andrew's LinkedIn
        </a>
      </footer>
    </div>
  );
}
