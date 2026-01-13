package expo.modules.floatingbubble

import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

class FloatingBubbleModule : Module() {
    private var floatView: View? = null
    private var windowManager: WindowManager? = null
    private var layoutParams: WindowManager.LayoutParams? = null
    private var initialX: Int = 0
    private var initialY: Int = 0
    private var initialTouchX: Float = 0f
    private var initialTouchY: Float = 0f

    override fun definition() = ModuleDefinition {
        Name("FloatingBubble")

        Events("onBubblePress", "onBubbleRemove", "onBubbleDrag")

        // Check if overlay permission is granted
        Function("hasOverlayPermission") {
            val context = appContext.reactContext ?: return@Function false
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Settings.canDrawOverlays(context)
            } else {
                true
            }
        }

        // Request overlay permission
        Function("requestOverlayPermission") {
            val context = appContext.reactContext ?: return@Function
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(context)) {
                    val intent = Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:${context.packageName}")
                    )
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(intent)
                }
            }
        }

        // Show the floating bubble
        AsyncFunction("showBubble") { x: Int, y: Int, promise: Promise ->
            val context = appContext.reactContext
            if (context == null) {
                promise.reject("E_CONTEXT", "Context is null", null)
                return@AsyncFunction
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
                promise.reject("E_PERMISSION", "Overlay permission not granted", null)
                return@AsyncFunction
            }

            try {
                appContext.activityProvider?.currentActivity?.runOnUiThread {
                    showFloatingBubble(context, x, y)
                    promise.resolve(true)
                }
            } catch (e: Exception) {
                promise.reject("E_BUBBLE", e.message, e)
            }
        }

        // Hide the floating bubble
        Function("hideBubble") {
            appContext.activityProvider?.currentActivity?.runOnUiThread {
                hideFloatingBubble()
            }
        }

        // Update bubble position
        Function("updatePosition") { x: Int, y: Int ->
            appContext.activityProvider?.currentActivity?.runOnUiThread {
                updateBubblePosition(x, y)
            }
        }

        // Check if bubble is visible
        Function("isVisible") {
            floatView != null
        }
    }

    private fun showFloatingBubble(context: Context, x: Int, y: Int) {
        if (floatView != null) return

        windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        // Create bubble view
        floatView = ImageView(context).apply {
            // Set bubble icon
            setImageResource(R.drawable.bubble_icon)
            scaleType = ImageView.ScaleType.CENTER_INSIDE
        }

        // Configure layout params for overlay
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        layoutParams = WindowManager.LayoutParams(
            150, // width
            150, // height
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            this.x = x
            this.y = y
        }

        // Add touch listener for drag and click
        floatView?.setOnTouchListener { view, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = layoutParams?.x ?: 0
                    initialY = layoutParams?.y ?: 0
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    layoutParams?.x = initialX + (event.rawX - initialTouchX).toInt()
                    layoutParams?.y = initialY + (event.rawY - initialTouchY).toInt()
                    windowManager?.updateViewLayout(floatView, layoutParams)
                    sendEvent("onBubbleDrag", mapOf(
                        "x" to (layoutParams?.x ?: 0),
                        "y" to (layoutParams?.y ?: 0)
                    ))
                    true
                }
                MotionEvent.ACTION_UP -> {
                    val deltaX = event.rawX - initialTouchX
                    val deltaY = event.rawY - initialTouchY
                    // If movement is small, consider it a click
                    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                        sendEvent("onBubblePress", mapOf(
                            "x" to (layoutParams?.x ?: 0),
                            "y" to (layoutParams?.y ?: 0)
                        ))
                    }
                    true
                }
                else -> false
            }
        }

        windowManager?.addView(floatView, layoutParams)
    }

    private fun hideFloatingBubble() {
        floatView?.let {
            windowManager?.removeView(it)
            sendEvent("onBubbleRemove", mapOf("removed" to true))
        }
        floatView = null
    }

    private fun updateBubblePosition(x: Int, y: Int) {
        layoutParams?.let { params ->
            params.x = x
            params.y = y
            windowManager?.updateViewLayout(floatView, params)
        }
    }
}
