console.log("Email Writer");

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return ''; // ✅ FIXED: Moved return outside the loop to try all selectors before returning
}

function findComposeToolbar() {
    const selectors = ['.btC', '.aDh', '[role="dialog"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null; // ✅ FIXED: Moved return null outside the loop to try all selectors
}

function createAIButton() {
    const buttonElement = document.createElement('div'); // ✅ FIXED: renamed from `button` to `buttonElement` to avoid scope collision
    buttonElement.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    buttonElement.style.marginRight = '8px';
    buttonElement.innerHTML = 'AI Reply';

    buttonElement.setAttribute('role', 'button');
    buttonElement.setAttribute('data-tooltip', 'Generate AI Reply');

    console.log("AI Button:", buttonElement);
    return buttonElement;
}

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

    console.log("Toolbar Found");
    const aiButton = createAIButton(); // ✅ FIXED: avoid using 'button' name here to prevent shadowing
    aiButton.classList.add('ai-Reply-button');

    aiButton.addEventListener('click', async () => {
        try {
            aiButton.innerHTML = 'Generating...';
            aiButton.setAttribute('disabled', 'true'); // ✅ FIXED: `div` elements don’t support `.disabled`, use attribute

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if (!response.ok) {
                throw new Error("API Request Failed");
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector(
                '[role="textbox"][g_editable="true"]'
            );
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }
        } catch (error) {
            console.log(error);
        } finally {
            aiButton.innerHTML = "AI Reply";
            aiButton.removeAttribute('disabled'); // ✅ FIXED: Properly remove disabled attribute
        }
    });

    toolbar.insertBefore(aiButton, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
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

observer.observe(document.body, {
    childList: true,
    subtree: true
});
