import React, { useEffect, useState } from 'react';

const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const removeScripts = (scriptUrls) => {
  scriptUrls.forEach((url) => {
    const script = document.querySelector(`script[src="${url}"]`);
    if (script) {
      document.body.removeChild(script);
    }
  });
};

const MainPage = () => {
  const [externalHtml, setExternalHtml] = useState('');

  useEffect(() => {
    const fetchExternalHtml = async () => {
      const response = await fetch('Nischinto - Template/index5.html');
      const html = await response.text();
      setExternalHtml(html);
    };

    fetchExternalHtml();
  }, []);

  useEffect(() => {
    const scriptsToAppend = [
      '/Nischinto - Template/assets/js/vendor/jquery-1.12.4.min.js',
      '/Nischinto - Template/assets/js/isotope.pkg.min.js',
      '/Nischinto - Template/assets/js/vendor/modernizr-3.5.0.min.js',
      '/Nischinto - Template/assets/js/jquery.slick.min.js',
      '/Nischinto - Template/assets/js/mailchimp.min.js',
      '/Nischinto - Template/assets/js/counter.min.js',
      '/Nischinto - Template/assets/js/lightgallery.min.js',
      '/Nischinto - Template/assets/js/ripples.min.js',
      '/Nischinto - Template/assets/js/wow.min.js',
      '/Nischinto - Template/assets/js/jQueryUi.js',
      '/Nischinto - Template/assets/js/textRotate.min.js',
      '/Nischinto - Template/assets/js/select2.min.js',
      '/Nischinto - Template/assets/js/main.js',
      '/Nischinto - Template/assets/js/custom.js',
    ];

    const stylesheetUrls = [
      '/Nischinto - Template/assets/css/style.css',
      // Add more stylesheet URLs as needed
    ];

    const loadScriptsSequentially = async () => {
      for (const scriptUrl of scriptsToAppend) {
        await loadScript(scriptUrl);
      }
    };

    loadScriptsSequentially();

    return () => {
      // /Nischinto - Template/assets/css/style.css
      removeScripts(scriptsToAppend);

      const existingLink = document.querySelector(`.stylecustomcss`);

      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, [externalHtml]);

  return <div dangerouslySetInnerHTML={{ __html: externalHtml }} />;
};

export default MainPage;
