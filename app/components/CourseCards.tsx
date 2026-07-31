import { CSSProperties } from "react";
import { LumenIcon } from "./LumenIcon";

export type PopularCourseStripProps = {
  href?: string;
  imageAlt?: string;
  imageSrc: string;
  title: string;
};

export function PopularCourseStrip({ href = "/course", imageAlt = "", imageSrc, title }: PopularCourseStripProps) {
  return (
    <a aria-label={`Open ${title}`} className="popular-course-strip" data-component="PopularCourseStrip" href={href}>
      <img alt={imageAlt} src={imageSrc} />
      <div className="popular-course-strip-panel">
        <span className="popular-course-strip-title">{title}</span>
        <span aria-hidden="true" className="popular-course-strip-action">
          <LumenIcon name="arrow-up-right" />
        </span>
      </div>
    </a>
  );
}

export type RecommendedCourseCardProps = {
  description: string;
  href?: string;
  imageAlt?: string;
  imageSrc: string;
  provider: string;
  rating: string;
  reviews: string;
  title: string;
};

function collapsedPanelWidthForTitle(title: string) {
  const extraTitleCharacters = Math.max(0, title.length - 19);

  return Math.min(264 + Math.ceil(extraTitleCharacters * 10.5), 340);
}

export function RecommendedCourseCard({
  description,
  href = "/course",
  imageAlt = "",
  imageSrc,
  provider,
  rating,
  reviews,
  title,
}: RecommendedCourseCardProps) {
  const style = {
    "--recommendation-panel-collapsed-width": `${collapsedPanelWidthForTitle(title)}px`,
  } as CSSProperties;

  return (
    <a aria-label={`Open ${title}`} className="recommendation-card" data-component="RecommendedCourseCard" href={href} style={style}>
      <img alt={imageAlt} src={imageSrc} />
      <div className="recommendation-panel">
        <div className="recommendation-copy">
          <h3 className="recommendation-title">
            <span className="sr-only">{title}</span>
            <span aria-hidden="true" className="recommendation-title-default">
              {title}
            </span>
            <span aria-hidden="true" className="recommendation-title-expanded">
              {title}
            </span>
          </h3>
          <p>{description}</p>
          <strong>{provider}</strong>
        </div>
        <div className="recommendation-footer">
          <div className="recommendation-meta">
            <span>{rating}</span>
            <span>{reviews}</span>
          </div>
          <span aria-hidden="true" className="recommendation-action">
            <LumenIcon name="arrow-up-right" />
          </span>
        </div>
      </div>
    </a>
  );
}
