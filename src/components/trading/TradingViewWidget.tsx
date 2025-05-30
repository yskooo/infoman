import { useEffect, useRef, useCallback } from 'react';

interface TradingViewWidgetOptions {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  hide_top_toolbar: boolean;
  hide_legend: boolean;
  save_image: boolean;
  container_id: string;
  studies: string[];
}

// Extend Window interface to include TradingView
declare global {
  interface Window {
    TradingView?: {
      widget: new (config: TradingViewWidgetOptions) => void;
    };
  }
}

// TradingView Widget component
const TradingViewWidget = ({
  symbol = 'AAPL',
  theme = 'dark',
  height = 400
}: {
  symbol?: string;
  theme?: string;
  height?: number;
}) => {
  const container = useRef<HTMLDivElement>(null);

  // Initialize or update the TradingView widget
  const initWidget = useCallback(() => {
    if (container.current && window.TradingView) {
      container.current.innerHTML = '';
      
      new window.TradingView.widget({
        autosize: true,
        symbol: `NASDAQ:${symbol}`,
        interval: "D",
        timezone: "exchange",
        theme: theme,
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: container.current.id,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
      });
    }
  }, [symbol, theme]);

  useEffect(() => {
    // Create the script element for TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = initWidget;

    // Add the script to the document
    document.head.appendChild(script);

    // Initial widget initialization
    initWidget();

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [initWidget]); // Re-run when initWidget changes

  return (
    <div 
      id={`tradingview_widget_${symbol}`} 
      ref={container} 
      style={{ height: `${height}px` }}
      className="w-full"
    />
  );
};

export default TradingViewWidget;
