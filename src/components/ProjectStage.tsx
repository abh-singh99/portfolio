import Image from 'next/image';
import type { ProjectScreenshots } from '@/content/projects';

// Brand-coloured card holding two screens: overlapping browser windows for web
// products, two staggered phones for apps. Both run off the card's edge.
export function ProjectStage({ screens, label }: { screens: ProjectScreenshots; label: string }) {
  const [back, front] = screens.images;
  const style = {
    '--stage-from': screens.brand.from,
    '--stage-to': screens.brand.to,
  } as React.CSSProperties;
  const description = screens.images.map((i) => i.alt).join('. ');

  return (
    <div role="img" aria-label={description} className="stage" style={style}>
      <span aria-hidden="true" className="stage-label">
        {label}
      </span>
      {screens.frame === 'browser' ? (
        <>
          <div className="stage-win stage-win-back">
            <Image src={back.src} alt="" width={back.width} height={back.height} sizes="(min-width: 1152px) 470px, 70vw" />
          </div>
          <div className="stage-win stage-win-front">
            <Image src={front.src} alt="" width={front.width} height={front.height} sizes="(min-width: 1152px) 480px, 72vw" />
          </div>
        </>
      ) : (
        <>
          <div className="stage-phone stage-phone-one">
            <Image src={back.src} alt="" width={back.width} height={back.height} sizes="(min-width: 1152px) 210px, 40vw" />
          </div>
          <div className="stage-phone stage-phone-two">
            <Image src={front.src} alt="" width={front.width} height={front.height} sizes="(min-width: 1152px) 210px, 40vw" />
          </div>
        </>
      )}
    </div>
  );
}
