// Preload image
//var img = document.createElement('img');
//img.src = chrome.extension.getURL("overlay.png");

// Helper function
function findFirstFilledOutPasswordInput()
{
    input = false;
    arDocuments = new Array();
    
    // add main document
    arDocuments.push(document);
    
    // add frames
    frames = document.getElementsByTagName('frame');
    for(i in frames)
        arDocuments.push(frames[i].contentDocument);
    
    // add iframes
    iframes = document.getElementsByTagName('frame');
    for(i in iframes)
        arDocuments.push(iframes[i].contentDocument);
    
    // iterate over documents looking for password inputs
    for(i in arDocuments)
    {
        result = document.evaluate("//input[@type='password']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        
        // iterate over password inputs looking for filled ones
        for(i=0;i<result.snapshotLength;i++)
        {
            if(result.snapshotItem(i).value != '')
            {
                input = result.snapshotItem(i);
                break;
            }
        }
        
        if(input)
            break;
    } 
    
    return input;
}
                
// Respond to requests from the background page
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) 
    {           
        input = findFirstFilledOutPasswordInput();
        
        // submit form
        if(input)
        {                
            if(request.overlay) // display cool graphic
            {
                var overlay = document.createElement('div');
                overlay.setAttribute('id','AutoLoginOverlay');
                overlay.style.height = document.height + 'px'; 
                //var img = document.createElement('img');
                //img.src = chrome.extension.getURL("overlay.png");
                //img.style.marginTop = ((window.innerHeight/2) - (256/2)) + 'px';
                //overlay.appendChild(img);
                h1 = document.createElement('h1');
                h1.innerText = 'Logging in...';
                h1.style.marginTop = ((window.innerHeight/2) - (50/2)) + 'px';
                overlay.appendChild(h1);
                document.body.appendChild(overlay);
            }
                
            input.form.submit();
        }
    }
);

// Check if the "page action" icon should be displayed
input = findFirstFilledOutPasswordInput()
chrome.extension.sendRequest({showIcon: (input != false)});