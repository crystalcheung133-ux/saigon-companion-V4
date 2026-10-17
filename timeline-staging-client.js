/* Local-only preview: staging HTTP disabled. */
(function(root){'use strict';root.createStagingClient=function(){throw Error('Cloud requests disabled in local-only preview');};})(globalThis);
