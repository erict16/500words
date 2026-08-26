// Recrawled 2026-08-26 from https://750words.com/_nuxt/V2vC6_NP.js (WritePage)
// plus EntryBrowser CuHKhKP7.js and WritePageFooter DYZtNmI2.js.
// Logged-in HTML still 403; these public chunks still ship.

// WritePage.toggleFocusMode
toggleFocusMode(){const t=this.focusMode;this.focusMode=!this.focusMode,this.focusMode?this.trackFocusModeEnabled():t&&this.trackFocusModeDisabled(),this.$nextTick(()=>{this.editor&&(this.editor.commands.focus("end"),this.isMobile&&this.handleMobileKeyboard())})}

// WritePage.handleEditorKeydown — F11 always toggles; Escape only while focused
handleEditorKeydown(t){if(t.key==="F11"||t.key==="Escape"&&this.focusMode){t.preventDefault(),this.toggleFocusMode();return}if((t.ctrlKey||t.metaKey)&&t.key==="s"){t.preventDefault(),this.saveEntry(!0);return}}

// WritePage.setupKeyboardShortcuts — same F11 / Esc on window, including TEXTAREA
setupKeyboardShortcuts(){this.keydownHandler=t=>{if(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA"){if(t.ctrlKey&&t.key==="s"){t.preventDefault(),this.saveEntry(!0);return}if(t.key==="F11"){t.preventDefault(),this.toggleFocusMode();return}if(t.key==="Escape"&&this.focusMode){t.preventDefault(),this.toggleFocusMode();return}return}if(t.key==="F11"){t.preventDefault(),this.toggleFocusMode();return}if(t.key==="Escape"&&this.focusMode){t.preventDefault(),this.toggleFocusMode();return}if((t.ctrlKey||t.metaKey)&&t.key==="s"){t.preventDefault(),this.saveEntry(!0);return}},window.addEventListener("keydown",this.keydownHandler)}

// Render: container class + hide entry-browser while focused; date + editor stay
// class=["write-page-container",{"focus-mode-active":t.focusMode}]
// class=["scrollable-content",{"focus-mode":t.focusMode}]
// t.focusMode ? empty : <div class="entry-browser-section"> <EntryBrowser show-focus-toggle=true onToggleFocus=toggleFocusMode />
handleFocusModeRequest(){this.toggleFocusMode()}

// EntryBrowser focus control (CuHKhKP7.js)
// v-btn variant="outlined" size="small" class="focus-toggle-btn ml-2"
//   title="Enter focus mode (F11)"
//   v-icon size="small">mdi-fullscreen

// WritePageFooter exit control (DYZtNmI2.js)
// v-if focusMode
// v-btn icon="" variant="elevated" size="small" class="exit-focus-btn"
//   title="Exit focus mode (F11 or ESC)"
//   v-icon size="small">mdi-fullscreen-exit
// Sibling of #write-page-footer, not inside the hidden .write-footer--focus bar.
// CSS: fixed top/right 20px; @media (max-width:800px) 36px circle, top/right 10px.
