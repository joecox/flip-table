function assert(bool, msg) {
  if (!bool) {
    throw new Error(msg);
  }
}

const buttonFlipText = "(╯°□°)╯︵ ┻━┻";
const buttonResetText = "Reset";

const table = document.getElementById("table")
const button = document.createElement("button")
button.innerText = buttonFlipText

if (table) {
  const buttonSlot = document.getElementById("button-slot")
  buttonSlot.appendChild(button)
}

button.addEventListener('click', flip);

function flip() {
  // Set button to reset state
  button.innerText = buttonResetText;
  button.removeEventListener('click', flip);
  button.addEventListener('click', reset);
  //----- end button state

  animate();
}

function reset() {
  // Set button to flip state
  button.innerText = buttonFlipText;
  button.removeEventListener('click', reset);
  button.addEventListener('click', flip);
  //----- end button state

  resetAnimation();
}

const animationDurationInSeconds = 0.5;
const nSteps = 100;
const rotationDeg = 180;
// const translationWidth = 100;
// const translationHeight = 200;

function rotation(step) {
  assert(step >= 0, `step gte 0, is ${step}`)
  assert(step <= nSteps, `step lte ${nSteps}, is ${step}`)
  return (step / nSteps) * rotationDeg;
}

function translation(step, translationWidth, translationHeight) {
  assert(step >= 0, `step gte 0, is ${step}`)
  assert(step <= nSteps, `step lte ${nSteps}, is ${step}`)
  const x = step / nSteps * translationWidth;
  // parabola:
  // y = coefficient * x * (x-translationWidth)
  // 100 = 2500 * 1/25
  // 100 = 2500 * coefficient
  // translationHeight = 2500 * coefficient
  // translationHeight = y when x = 0.5w * coefficient
  // translationHeight = -0.25translationWidth^2 * coefficient
  // coefficient = translationHeight / (-0.25 * translationWidth^2)
  const coefficient = translationHeight / (0.25 * (translationWidth ** 2));
  const y = coefficient * x * (x - translationWidth);
  return { x, y }
}

let flipTranslateXKeyframesIdx = 0;
function flipTranslateXKeyframes(translationWidth) {
  const name = `flipTranslateX${flipTranslateXKeyframesIdx++}`
  const cssText = `
    @keyframes ${name} {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(${translationWidth}px);
      }
    }
  `
  return {
    name,
    cssText,
  }
}

let flipTranslateYKeyframesIdx = 0;
function flipTranslateYKeyframes(translationWidth, translationHeight) {
  const name = `flipTranslateY${flipTranslateYKeyframesIdx++}`
  const cssText = `
    @keyframes ${name} {
      ${Array(nSteps + 1).fill().map((_, idx) => {
        const { y } = translation(idx, translationWidth, translationHeight);
        return (`
          ${idx}% {
            transform: translateY(${y}px);
          }
        `)
      }).join('\n')}
    }
  `
  return {
    name,
    cssText,
  }
}

const stylesheet = new CSSStyleSheet();
function animate() {
  // const cssText = `
  //   #table {
  //     &.animate {
  //       animation-name: flip;
  //       animation-duration: 0.5s;
  //       animation-fill-mode: forwards;
  //     }
  //   }

  //   @keyframes flip {
  //     ${Array(nSteps + 1).fill().map((_, idx) => {
  //       const [x, y] = translation(idx);
  //       const deg = rotation(idx);
  //       return (`
  //         ${idx}% {
  //           transform: translate(${x}px, ${y}px) rotate(${deg}deg);
  //         }
  //       `)
  //     }).join('\n')}
  //   }
  // `;

  const rootTableXAnimation = flipTranslateXKeyframes(150);
  const rootTableYAnimation = flipTranslateYKeyframes(150, 200);

  const otherXAnimation = flipTranslateXKeyframes(-20);
  const otherYAnimation = flipTranslateYKeyframes(-20, 30);

  const cssText = `
    #table {
      &.animate {
        animation-name: ${rootTableXAnimation.name}, ${rootTableYAnimation.name}, flipRotate;
        animation-duration: ${animationDurationInSeconds}s;
        animation-fill-mode: forwards;
        animation-composition: add;
        animation-timeline: scroll();
      }
    }

    #table.animate {
      #other {
        animation-name: ${otherXAnimation.name}, ${otherYAnimation.name};
        animation-duration: ${animationDurationInSeconds}s;
        animation-fill-mode: forwards;
        animation-composition: add;
        animation-timeline: scroll();
      }
    }

    ${rootTableXAnimation.cssText}
    ${rootTableYAnimation.cssText}

    ${otherXAnimation.cssText}
    ${otherYAnimation.cssText}

    @keyframes flipRotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(${rotationDeg}deg);
      }
    }
  `
  console.log(cssText);
  stylesheet.replaceSync(cssText);
  document.adoptedStyleSheets = [stylesheet];
  table.classList.add('animate');
}
function resetAnimation() {
  table.classList.remove('animate');
  document.adoptedStyleSheets = [];
}
