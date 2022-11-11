Pod::Spec.new do |s|
	s.version                 = "6.51.0"
   	s.name                    = "PushIOManager"
   	s.summary                 = "Responsys iOS SDK"
   	s.documentation_url       = ""
   	s.homepage                = "https://github.com/pushio/PushIOManager_iOS"
   	s.author                  = "Oracle"
        s.license                 = ""
   	s.source                  = { :git => "https://github.com/pushio/PushIOManager_iOS", :tag => s.version.to_s }

   	s.module_name             = "PushIOManager"
   	s.ios.deployment_target   = "13.0"
   	s.requires_arc            =  true

   	s.vendored_frameworks 	  = "framework/PushIOManager.xcframework"
    s.preserve_paths 	  = "framework/PushIOManager.xcframework"
   	
   	s.libraries               = 'sqlite3'
   	s.frameworks              = 'UserNotifications', 'CoreLocation', 'Foundation', 'UIKit'
   	s.ios.frameworks          = 'WebKit'
	s.pod_target_xcconfig = { 'OTHER_LDFLAGS' => '-ObjC' }
end
