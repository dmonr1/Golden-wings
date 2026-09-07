function AtmosphericClouds() {
  return (
    <div className="atmospheric-clouds" aria-hidden="true">
      {/* =========================================================================
          1. DESKTOP CLOUDS (Landscape viewports > 768px)
          ========================================================================= */}
      <div className="clouds-track clouds-track--desktop clouds-track--back">
        <svg
          className="clouds-svg"
          viewBox="0 0 2800 500"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cloudGradBackDesk" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Section A (0 - 1400px) */}
          <g className="cloud-group">
            <path
              d="M 80,95 C 100,45 160,30 220,50 C 270,15 360,15 420,55 C 480,35 550,55 580,95 C 630,85 680,115 680,160 C 680,185 640,205 590,200 L 90,200 C 50,195 60,125 80,95 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 820,80 C 860,30 940,20 1000,50 C 1050,15 1140,15 1200,55 C 1260,40 1320,65 1340,105 C 1380,115 1410,155 1390,190 L 800,190 C 770,170 790,110 820,80 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 320,240 C 350,185 430,170 490,205 C 540,165 630,165 690,205 C 750,190 810,215 830,255 C 870,265 900,305 880,340 L 290,340 C 260,320 290,260 320,240 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 40,380 C 60,325 120,310 180,335 C 230,295 320,295 380,335 C 440,315 510,335 540,375 C 590,365 640,395 640,440 L 50,440 C 20,430 20,405 40,380 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 720,360 C 750,305 830,290 890,325 C 940,285 1030,285 1090,325 C 1150,310 1210,335 1230,375 C 1270,385 1300,425 1280,460 L 690,460 C 660,440 690,380 720,360 Z"
              fill="url(#cloudGradBackDesk)"
            />
          </g>

          {/* Section B (1400 - 2800px) */}
          <g className="cloud-group" transform="translate(1400, 0)">
            <path
              d="M 80,95 C 100,45 160,30 220,50 C 270,15 360,15 420,55 C 480,35 550,55 580,95 C 630,85 680,115 680,160 C 680,185 640,205 590,200 L 90,200 C 50,195 60,125 80,95 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 820,80 C 860,30 940,20 1000,50 C 1050,15 1140,15 1200,55 C 1260,40 1320,65 1340,105 C 1380,115 1410,155 1390,190 L 800,190 C 770,170 790,110 820,80 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 320,240 C 350,185 430,170 490,205 C 540,165 630,165 690,205 C 750,190 810,215 830,255 C 870,265 900,305 880,340 L 290,340 C 260,320 290,260 320,240 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 40,380 C 60,325 120,310 180,335 C 230,295 320,295 380,335 C 440,315 510,335 540,375 C 590,365 640,395 640,440 L 50,440 C 20,430 20,405 40,380 Z"
              fill="url(#cloudGradBackDesk)"
            />
            <path
              d="M 720,360 C 750,305 830,290 890,325 C 940,285 1030,285 1090,325 C 1150,310 1210,335 1230,375 C 1270,385 1300,425 1280,460 L 690,460 C 660,440 690,380 720,360 Z"
              fill="url(#cloudGradBackDesk)"
            />
          </g>
        </svg>
      </div>

      <div className="clouds-track clouds-track--desktop clouds-track--front">
        <svg
          className="clouds-svg"
          viewBox="0 0 2800 500"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cloudGradFrontDesk" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient id="cloudGradWispDesk" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Section A (0 - 1400px) */}
          <g className="cloud-group">
            {/* Top Sky */}
            <path
              d="M 120,90 Q 130,45 180,45 Q 200,10 255,10 Q 310,5 345,35 Q 390,25 425,55 Q 480,55 495,100 Q 515,135 480,155 Q 440,165 390,160 Q 340,165 260,160 Q 180,165 130,150 Q 90,135 120,90 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 540,45 C 600,15 710,10 830,28 C 950,45 1070,22 1170,40 C 1240,52 1270,76 1190,88 C 1070,102 930,92 780,98 C 660,104 560,88 540,45 Z"
              fill="url(#cloudGradWispDesk)"
            />
            <path
              d="M 940,85 C 965,35 1025,20 1080,40 C 1130,10 1210,15 1260,50 C 1320,35 1385,60 1400,100 C 1425,140 1380,170 1320,165 C 1230,175 1130,167 1040,170 C 970,165 930,125 940,85 Z"
              fill="url(#cloudGradFrontDesk)"
            />

            {/* Mid Sky */}
            <path
              d="M 60,230 Q 75,180 125,180 Q 145,140 200,140 Q 255,130 290,165 Q 335,155 370,185 Q 425,185 440,230 Q 460,265 425,285 Q 385,295 335,290 Q 285,295 205,290 Q 125,295 75,280 Q 35,265 60,230 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 480,210 C 510,160 570,145 625,165 C 675,130 755,135 805,170 C 865,155 930,180 945,220 C 970,260 925,290 865,285 C 775,295 675,287 585,290 C 515,285 475,250 480,210 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 980,200 C 1030,175 1120,170 1210,185 C 1300,200 1380,180 1430,200 C 1470,215 1450,235 1390,245 C 1300,255 1200,248 1110,252 C 1020,255 960,235 980,200 Z"
              fill="url(#cloudGradWispDesk)"
            />

            {/* Lower Sky */}
            <path
              d="M 180,360 Q 195,310 245,310 Q 265,270 320,270 Q 375,260 410,295 Q 455,285 490,315 Q 545,315 560,360 Q 580,395 545,415 Q 505,425 455,420 Q 405,425 325,420 Q 245,425 195,410 Q 155,395 180,360 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 680,350 C 710,300 770,285 825,305 C 875,270 955,275 1005,310 C 1065,295 1130,320 1145,360 C 1170,400 1125,430 1065,425 C 975,435 875,427 785,430 C 715,425 675,390 680,350 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 1200,370 C 1240,335 1290,330 1320,355 C 1340,375 1325,400 1280,403 C 1220,407 1170,397 1200,370 Z"
              fill="url(#cloudGradFrontDesk)"
            />
          </g>

          {/* Section B (1400 - 2800px) */}
          <g className="cloud-group" transform="translate(1400, 0)">
            <path
              d="M 120,90 Q 130,45 180,45 Q 200,10 255,10 Q 310,5 345,35 Q 390,25 425,55 Q 480,55 495,100 Q 515,135 480,155 Q 440,165 390,160 Q 340,165 260,160 Q 180,165 130,150 Q 90,135 120,90 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 540,45 C 600,15 710,10 830,28 C 950,45 1070,22 1170,40 C 1240,52 1270,76 1190,88 C 1070,102 930,92 780,98 C 660,104 560,88 540,45 Z"
              fill="url(#cloudGradWispDesk)"
            />
            <path
              d="M 940,85 C 965,35 1025,20 1080,40 C 1130,10 1210,15 1260,50 C 1320,35 1385,60 1400,100 C 1425,140 1380,170 1320,165 C 1230,175 1130,167 1040,170 C 970,165 930,125 940,85 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 60,230 Q 75,180 125,180 Q 145,140 200,140 Q 255,130 290,165 Q 335,155 370,185 Q 425,185 440,230 Q 460,265 425,285 Q 385,295 335,290 Q 285,295 205,290 Q 125,295 75,280 Q 35,265 60,230 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 480,210 C 510,160 570,145 625,165 C 675,130 755,135 805,170 C 865,155 930,180 945,220 C 970,260 925,290 865,285 C 775,295 675,287 585,290 C 515,285 475,250 480,210 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 980,200 C 1030,175 1120,170 1210,185 C 1300,200 1380,180 1430,200 C 1470,215 1450,235 1390,245 C 1300,255 1200,248 1110,252 C 1020,255 960,235 980,200 Z"
              fill="url(#cloudGradWispDesk)"
            />
            <path
              d="M 180,360 Q 195,310 245,310 Q 265,270 320,270 Q 375,260 410,295 Q 455,285 490,315 Q 545,315 560,360 Q 580,395 545,415 Q 505,425 455,420 Q 405,425 325,420 Q 245,425 195,410 Q 155,395 180,360 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 680,350 C 710,300 770,285 825,305 C 875,270 955,275 1005,310 C 1065,295 1130,320 1145,360 C 1170,400 1125,430 1065,425 C 975,435 875,427 785,430 C 715,425 675,390 680,350 Z"
              fill="url(#cloudGradFrontDesk)"
            />
            <path
              d="M 1200,370 C 1240,335 1290,330 1320,355 C 1340,375 1325,400 1280,403 C 1220,407 1170,397 1200,370 Z"
              fill="url(#cloudGradFrontDesk)"
            />
          </g>
        </svg>
      </div>

      {/* =========================================================================
          2. MOBILE CLOUDS (Tailored for Tall Portrait Viewports <= 768px)
          ViewBox is 1600 x 1000: 5 distinct vertical height tiers covering top to bottom!
          ========================================================================= */}
      <div className="clouds-track clouds-track--mobile clouds-track--back">
        <svg
          className="clouds-svg"
          viewBox="0 0 1600 1000"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cloudGradBackMob" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Section A (0 - 800px) */}
          <g className="cloud-group">
            {/* Tier 1: Very Top Sky (Y: 0 - 180) */}
            <path
              d="M 10,0 L 520,0 C 510,50 470,80 430,95 C 380,130 300,125 250,90 C 200,120 120,120 70,80 C 40,65 15,35 10,0 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 480,90 C 510,35 580,20 640,45 C 690,10 780,15 800,60 L 800,170 C 760,180 710,165 670,140 C 620,165 540,160 500,120 C 475,105 480,95 480,90 Z"
              fill="url(#cloudGradBackMob)"
            />

            {/* Tier 2: Upper Mid (Y: 180 - 360) */}
            <path
              d="M 70,260 C 90,205 160,190 220,215 C 270,175 360,175 420,215 C 455,240 460,285 430,325 C 390,355 310,350 260,320 C 210,350 130,345 80,310 C 50,290 60,270 70,260 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 420,300 C 450,245 530,230 590,265 C 640,225 730,225 780,265 C 805,290 805,335 770,365 C 720,395 640,390 590,360 C 540,390 460,385 420,350 C 400,330 410,310 420,300 Z"
              fill="url(#cloudGradBackMob)"
            />

            {/* Tier 3: True Center (Y: 380 - 560) */}
            <path
              d="M 50,460 C 70,405 140,390 200,415 C 250,375 340,375 400,415 C 425,445 425,490 390,520 C 340,550 260,545 210,515 C 160,545 80,540 40,505 C 20,485 35,465 50,460 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 390,480 C 420,425 500,410 560,445 C 610,405 700,405 760,445 C 785,475 785,520 750,550 C 700,580 620,575 570,545 C 520,575 440,570 390,535 C 370,515 380,490 390,480 Z"
              fill="url(#cloudGradBackMob)"
            />

            {/* Tier 4: Lower Mid (Y: 570 - 760) */}
            <path
              d="M 60,650 C 80,595 150,580 210,605 C 260,565 350,565 410,605 C 445,635 445,680 410,715 C 360,745 280,740 230,710 C 180,740 100,735 55,700 C 35,680 45,655 60,650 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 420,670 C 450,615 530,600 590,635 C 640,595 730,595 780,635 C 805,665 805,710 770,740 C 720,770 640,765 590,735 C 540,765 460,760 415,725 C 395,705 405,680 420,670 Z"
              fill="url(#cloudGradBackMob)"
            />

            {/* Tier 5: Very Bottom / Touching Wave (Y: 760 - 1000) */}
            <path
              d="M 0,840 C 30,785 100,770 160,795 C 210,755 300,755 360,795 C 410,780 460,805 480,845 C 490,880 470,920 440,950 L 440,1000 L 0,1000 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 380,860 C 410,805 490,790 550,825 C 600,785 690,785 750,825 C 785,850 795,890 780,930 L 780,1000 L 340,1000 L 340,910 C 330,885 360,865 380,860 Z"
              fill="url(#cloudGradBackMob)"
            />
          </g>

          {/* Section B (800 - 1600px) */}
          <g className="cloud-group" transform="translate(800, 0)">
            <path
              d="M 10,0 L 520,0 C 510,50 470,80 430,95 C 380,130 300,125 250,90 C 200,120 120,120 70,80 C 40,65 15,35 10,0 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 480,90 C 510,35 580,20 640,45 C 690,10 780,15 800,60 L 800,170 C 760,180 710,165 670,140 C 620,165 540,160 500,120 C 475,105 480,95 480,90 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 70,260 C 90,205 160,190 220,215 C 270,175 360,175 420,215 C 455,240 460,285 430,325 C 390,355 310,350 260,320 C 210,350 130,345 80,310 C 50,290 60,270 70,260 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 420,300 C 450,245 530,230 590,265 C 640,225 730,225 780,265 C 805,290 805,335 770,365 C 720,395 640,390 590,360 C 540,390 460,385 420,350 C 400,330 410,310 420,300 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 50,460 C 70,405 140,390 200,415 C 250,375 340,375 400,415 C 425,445 425,490 390,520 C 340,550 260,545 210,515 C 160,545 80,540 40,505 C 20,485 35,465 50,460 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 390,480 C 420,425 500,410 560,445 C 610,405 700,405 760,445 C 785,475 785,520 750,550 C 700,580 620,575 570,545 C 520,575 440,570 390,535 C 370,515 380,490 390,480 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 60,650 C 80,595 150,580 210,605 C 260,565 350,565 410,605 C 445,635 445,680 410,715 C 360,745 280,740 230,710 C 180,740 100,735 55,700 C 35,680 45,655 60,650 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 420,670 C 450,615 530,600 590,635 C 640,595 730,595 780,635 C 805,665 805,710 770,740 C 720,770 640,765 590,735 C 540,765 460,760 415,725 C 395,705 405,680 420,670 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 0,840 C 30,785 100,770 160,795 C 210,755 300,755 360,795 C 410,780 460,805 480,845 C 490,880 470,920 440,950 L 440,1000 L 0,1000 Z"
              fill="url(#cloudGradBackMob)"
            />
            <path
              d="M 380,860 C 410,805 490,790 550,825 C 600,785 690,785 750,825 C 785,850 795,890 780,930 L 780,1000 L 340,1000 L 340,910 C 330,885 360,865 380,860 Z"
              fill="url(#cloudGradBackMob)"
            />
          </g>
        </svg>
      </div>

      <div className="clouds-track clouds-track--mobile clouds-track--front">
        <svg
          className="clouds-svg"
          viewBox="0 0 1600 1000"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cloudGradFrontMob" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Section A (0 - 800px) */}
          <g className="cloud-group">
            {/* 1. TOP SKY (Y: 0 - 170) */}
            <path
              d="M 80,0 L 460,0 C 450,45 415,75 375,90 C 330,120 260,115 215,85 C 170,110 100,105 60,70 C 45,50 60,20 80,0 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 450,80 Q 465,30 520,30 Q 545,0 600,0 Q 655,0 690,30 Q 735,20 770,55 Q 790,95 760,130 Q 710,155 650,150 Q 580,155 520,130 Q 450,125 450,80 Z"
              fill="url(#cloudGradFrontMob)"
            />

            {/* 2. UPPER MID (Y: 170 - 350) */}
            <path
              d="M 50,260 Q 65,210 120,210 Q 140,170 200,170 Q 260,160 295,195 Q 345,185 380,220 Q 430,220 440,265 Q 455,305 415,325 Q 365,335 305,330 Q 235,335 170,325 Q 90,330 50,260 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 440,280 C 470,230 540,215 600,240 C 650,205 730,210 775,250 C 805,280 800,325 760,350 C 700,370 610,365 540,350 C 470,355 430,320 440,280 Z"
              fill="url(#cloudGradFrontMob)"
            />

            {/* 3. CENTER (Y: 360 - 540) */}
            <path
              d="M 80,450 Q 95,400 150,400 Q 170,360 230,360 Q 290,350 325,385 Q 375,375 410,410 Q 460,410 470,455 Q 485,495 445,515 Q 395,525 335,520 Q 265,525 200,515 Q 120,520 80,450 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 460,470 C 490,420 560,405 620,430 C 670,395 750,400 795,440 C 815,475 805,515 770,540 C 710,560 620,555 550,540 C 480,545 440,510 460,470 Z"
              fill="url(#cloudGradFrontMob)"
            />

            {/* 4. LOWER MID (Y: 550 - 740) */}
            <path
              d="M 60,640 Q 75,590 130,590 Q 150,550 210,550 Q 270,540 305,575 Q 355,565 390,600 Q 440,600 450,645 Q 465,685 425,705 Q 375,715 315,710 Q 245,715 180,705 Q 100,710 60,640 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 440,660 C 470,610 540,595 600,620 C 650,585 730,590 775,630 C 805,660 800,705 760,730 C 700,750 610,745 540,730 C 470,735 430,700 440,660 Z"
              fill="url(#cloudGradFrontMob)"
            />

            {/* 5. BOTTOM SKY / OVER WAVE (Y: 740 - 1000) */}
            <path
              d="M 40,840 Q 55,790 110,790 Q 130,750 190,750 Q 250,740 285,775 Q 335,765 370,800 Q 420,800 440,845 Q 465,885 450,930 L 450,1000 L 0,1000 L 0,910 Q 15,870 40,840 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 420,850 C 450,800 520,785 580,810 C 630,775 710,780 755,820 C 785,850 795,890 780,930 L 780,1000 L 360,1000 L 360,920 C 365,885 395,860 420,850 Z"
              fill="url(#cloudGradFrontMob)"
            />
          </g>

          {/* Section B (800 - 1600px) - Exact duplicate for seamless loop */}
          <g className="cloud-group" transform="translate(800, 0)">
            <path
              d="M 80,0 L 460,0 C 450,45 415,75 375,90 C 330,120 260,115 215,85 C 170,110 100,105 60,70 C 45,50 60,20 80,0 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 450,80 Q 465,30 520,30 Q 545,0 600,0 Q 655,0 690,30 Q 735,20 770,55 Q 790,95 760,130 Q 710,155 650,150 Q 580,155 520,130 Q 450,125 450,80 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 50,260 Q 65,210 120,210 Q 140,170 200,170 Q 260,160 295,195 Q 345,185 380,220 Q 430,220 440,265 Q 455,305 415,325 Q 365,335 305,330 Q 235,335 170,325 Q 90,330 50,260 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 440,280 C 470,230 540,215 600,240 C 650,205 730,210 775,250 C 805,280 800,325 760,350 C 700,370 610,365 540,350 C 470,355 430,320 440,280 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 80,450 Q 95,400 150,400 Q 170,360 230,360 Q 290,350 325,385 Q 375,375 410,410 Q 460,410 470,455 Q 485,495 445,515 Q 395,525 335,520 Q 265,525 200,515 Q 120,520 80,450 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 460,470 C 490,420 560,405 620,430 C 670,395 750,400 795,440 C 815,475 805,515 770,540 C 710,560 620,555 550,540 C 480,545 440,510 460,470 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 60,640 Q 75,590 130,590 Q 150,550 210,550 Q 270,540 305,575 Q 355,565 390,600 Q 440,600 450,645 Q 465,685 425,705 Q 375,715 315,710 Q 245,715 180,705 Q 100,710 60,640 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 440,660 C 470,610 540,595 600,620 C 650,585 730,590 775,630 C 805,660 800,705 760,730 C 700,750 610,745 540,730 C 470,735 430,700 440,660 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 40,840 Q 55,790 110,790 Q 130,750 190,750 Q 250,740 285,775 Q 335,765 370,800 Q 420,800 440,845 Q 465,885 450,930 L 450,1000 L 0,1000 L 0,910 Q 15,870 40,840 Z"
              fill="url(#cloudGradFrontMob)"
            />
            <path
              d="M 420,850 C 450,800 520,785 580,810 C 630,775 710,780 755,820 C 785,850 795,890 780,930 L 780,1000 L 360,1000 L 360,920 C 365,885 395,860 420,850 Z"
              fill="url(#cloudGradFrontMob)"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default AtmosphericClouds
