import Head from 'next/head'
import { Card, Flex, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import PageTitle from 'components/PageTitle/PageTitle'
import Script from 'next/script'
import { FC } from 'react'
import Page from '../Page'

const Bridge: FC = () => {
  return (
    <>
      {/* 
      // @ts-ignore  */}
      <style jsx global>{`
        .MuiTypography-subtitle1 {
          color: #fff !important;
        }
        .MuiSvgIcon-root {
          color: #fff !important;
          fill: #fff !important;
        }
        .MuiScopedCssBaseline-root {
          background: transparent !important;
        }
        .MuiPaper-root {
          color: #ccc;
          backdrop-filter: blur(16px);
          background: linear-gradient(to top,#111,#333);
        }
        .MuiInputBase-root {
          border-radius: 8px;
          border: 3px solid #fff;
          background: linear-gradient(to top,#111,#333);
        }
        .MuiFab-root {
          border-radius: 8px;
          height: 48px;
          width: 48px;
          margin-top: 12px;
          margin-bottom: 12px;
          box-shadow: inset 0px -2px 0px rgba(0,0,0,0.1);
          background-color: #0154FE;
          border: 3px solid white;
        }
        .MuiFab-root:hover {
          opacity: 0.8;
          background-color: #0154FE;
        }
        .MuiFab-root:active {
          box-shadow: inset 0px 0px 12px rgba(0, 0, 0, 1), 0px 0px 12px #fff !important;
        }
        .MuiButton-containedPrimary {
          transition: background-color 0.2s, opacity 0.2s;
          box-shadow: 0px -1px 0px 0px rgba(14,14,44,0.4) inset;
          background-color: #fff;
          color: #0154FE;
          font-weight: 900;
          font-size: 14px;
          border-radius: 8px;
          border: 4px solid;
          height: 54px;
          border-color: #0154FE;
          width: 100%;
          padding: 12px;
        }
        .MuiButton-containedPrimary:hover {
          background-color: #000;
          color: #FFF;
        }
        .MuiButton-containedPrimary:active {
          opacity: 0.85;
          -webkit-transform: translateY(1px);
          -ms-transform: translateY(1px);
          transform: translateY(1px);
          background: transparent !important;
          box-shadow: none;
          color: #fff; 
        }
        .MuiButton-contained.Mui-disabled, .MuiButton-contained.Mui-disabled:hover {
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
      <Script src="https://unpkg.com/@layerzerolabs/stargate-ui@latest/element.js" defer async />
      <Page>
        <PageTitle title="Bridge" />
        <Flex
          width="95%"
          minWidth="95%"
          justifyContent="center"
          position="relative"
          marginLeft="auto"
          marginRight="auto"
          marginTop={20}
          marginBottom={60}
        >
          <Card>
            {/* 
              // @ts-ignore  */}
            <stargate-widget
              theme="dark"
              partnerId="0x0019"
              feeCollector="0x34D13FCF6150D6d8Da48F36B8361C3d161e39fac"
              tenthBps="10"
            />
          </Card>
        </Flex>
      </Page>
    </>
  )
}

export default Bridge