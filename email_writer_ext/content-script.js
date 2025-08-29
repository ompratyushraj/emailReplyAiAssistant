console.log("Email Writer Assistant Content Script Loaded");

// --- Global Observer Variable ---
let observer = null;

// --- Function to get email content ---
function getEmailContent() {
    const selectors = ['.h7', '.a3s.aiL', '.gmail_quote', '[role="presentation"]'];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

// --- Function to find Gmail compose toolbar ---
function findComposeToolbar() {
    const selectors = ['.btC', '.aDh', '[role="dialog"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

// --- Create the AI button ---
function createAIButton() {
    const buttonElement = document.createElement('div');
    buttonElement.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    buttonElement.style.marginRight = '8px';
    buttonElement.innerHTML = 'AI Reply';
    buttonElement.setAttribute('role', 'button');
    buttonElement.setAttribute('data-tooltip', 'Generate AI Reply');
    return buttonElement;
}

// --- Inject the AI button ---
function injectButton() {
    const existingButton = document.querySelector('.ai-Reply-button');
    if (existingButton) {
        existingButton.remove();
    }

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    const aiButton = createAIButton();
    aiButton.classList.add('ai-Reply-button');

    aiButton.addEventListener('click', async () => {
        try {
            aiButton.innerHTML = 'Generating...';
            aiButton.setAttribute('disabled', 'true');

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if (!response.ok) throw new Error("API Request Failed");

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }
        } catch (error) {
            console.log(error);
        } finally {
            aiButton.innerHTML = "AI Reply";
            aiButton.removeAttribute('disabled');
        }
    });

    toolbar.insertBefore(aiButton, toolbar.firstChild);
}

// --- Create Mutation Observer to watch for compose windows ---
function createObserver() {
    return new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const addedNodes = Array.from(mutation.addedNodes);
            const hasComposeElements = addedNodes.some(node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (
                    node.matches?.('.aDh, .btC, [role="dialog"]') ||
                    node.querySelector?.('.aDh, .btC, [role="dialog"]')
                )
            );

            if (hasComposeElements) {
                console.log("Compose Window Detected.");
                setTimeout(injectButton, 500);
            }
        }
    });
}

// --- Enable/Disable extension functionality based on setting ---
function handleExtensionState(enabled) {
    if (enabled) {
        if (!observer) {
            observer = createObserver();
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log("AI Assistant Enabled");
        }
    } else {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log("AI Assistant Disabled");

            // Remove any injected buttons
            document.querySelectorAll('.ai-Reply-button').forEach(btn => btn.remove());
        }
    }
}

// --- Initial load: check state from storage ---
chrome.storage.sync.get(['enabled'], (result) => {
    const enabled = result.enabled ?? true;
    handleExtensionState(enabled);
});

// --- Listen for changes from popup toggle ---
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.enabled) {
        const newValue = changes.enabled.newValue;
        handleExtensionState(newValue);
    }
});
