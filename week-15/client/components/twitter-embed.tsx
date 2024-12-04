import Script from 'next/script';

export function TwitterEmbed({ link }:{link:string}) {
    console.log(link,'link')
  return (
    <>
      <blockquote 
        className="twitter-tweet" 
        data-theme="light"
      >
        <a href={link.replace('x.com','twitter.com')}></a>
      </blockquote>
      <Script 
        src="https://platform.twitter.com/widgets.js" 
        strategy="lazyOnload" 
      />
    </>
  );
}