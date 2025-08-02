# Arkadium Sandbox Troubleshooting Guide

## Problem: Game Not Loading in Arkadium Sandbox

If your Daily Quote Puzzle game is not loading properly in the Arkadium sandbox, here are the steps to diagnose and fix the issue:

## Quick Fixes

### 1. Use the Simplified Version
Try the simplified version first: `daily_quote_puzzle_simple.html`
- Removes complex dependencies (PixiJS)
- Focuses on core game functionality
- More likely to work in sandbox environment

### 2. Test SDK Connection
Use the test file: `arkadium_sandbox_test.html`
- Tests SDK initialization
- Checks environment compatibility
- Provides detailed error logging

## Common Issues and Solutions

### Issue 1: SDK Not Loading
**Symptoms:** Console shows "ArkadiumGameSDK not available"
**Solutions:**
- Check if you're on an Arkadium domain
- Ensure the SDK script is loaded: `https://developers.arkadium.com/cdn/sdk/v2/sdk.js`
- Wait for SDK to be available (up to 5 seconds)

### Issue 2: Lifecycle Events Not Working
**Symptoms:** Game loads but doesn't communicate with Arkadium
**Solutions:**
- Check if `sdk.lifecycle` exists before calling methods
- Use try-catch blocks around lifecycle calls
- Ensure `onTestReady()` is called after game initialization

### Issue 3: Game Stuck on Loading
**Symptoms:** "Loading game..." message persists
**Solutions:**
- Check browser console for JavaScript errors
- Ensure all required functions are defined
- Try the simplified version without complex animations

### Issue 4: Analytics Not Tracking
**Symptoms:** No analytics events being sent
**Solutions:**
- Check if `sdk.analytics` exists
- Wrap analytics calls in try-catch blocks
- Use fallback logging for debugging

## Testing Steps

### Step 1: Environment Check
1. Open `arkadium_sandbox_test.html` in the Arkadium sandbox
2. Check the "Environment Check" section
3. Verify SDK availability

### Step 2: SDK Initialization
1. Click "Test SDK Initialization"
2. Check console output for errors
3. Verify SDK instance is created

### Step 3: Lifecycle Testing
1. Click "Test Lifecycle Events"
2. Verify `onTestReady()` and `onGameStart()` work
3. Check for any error messages

### Step 4: Game Testing
1. Try the simplified game: `daily_quote_puzzle_simple.html`
2. Check if game loads and is playable
3. Test word solving functionality

## Debug Information

### Console Logs to Look For
```
✅ Good logs:
- "SDK initialized successfully"
- "onTestReady() called"
- "onGameStart() called"
- "Game initialized successfully"

❌ Error logs:
- "SDK not available"
- "Failed to initialize Arkadium SDK"
- "Lifecycle test failed"
```

### Environment Variables
Check these in the test file:
- Hostname (should include 'arkadium')
- Protocol (should be https)
- SDK Available (should be Yes)
- User Agent (should match expected browser)

## File Structure

```
dailyquote3/
├── daily_quote_puzzle.html          # Original game (complex)
├── daily_quote_puzzle_simple.html   # Simplified version
├── arkadium_sandbox_test.html       # SDK test tool
├── test_sdk.html                    # Basic SDK test
└── ARKADIUM_TROUBLESHOOTING.md     # This guide
```

## Recommended Testing Order

1. **Start with the test file:** `arkadium_sandbox_test.html`
2. **Try the simple game:** `daily_quote_puzzle_simple.html`
3. **If those work, try the full game:** `daily_quote_puzzle.html`

## Contact Information

If you're still having issues:
1. Check the browser console for specific error messages
2. Use the test file to identify the exact problem
3. Note the environment details (hostname, protocol, etc.)
4. Try the simplified version first

## Common Error Messages

| Error | Solution |
|-------|----------|
| "SDK not available" | Wait longer for SDK to load, check domain |
| "Lifecycle test failed" | Check if sandbox supports lifecycle events |
| "Analytics not available" | Analytics may be disabled in test environment |
| "Game initialization failed" | Try simplified version, check console errors |

## Browser Compatibility

The game should work in:
- Chrome (recommended)
- Firefox
- Safari
- Edge

Make sure JavaScript is enabled and cookies are allowed. 