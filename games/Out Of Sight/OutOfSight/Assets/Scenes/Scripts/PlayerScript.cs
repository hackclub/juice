using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerScript : MonoBehaviour
{
    [SerializeField] private Animator animator;
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 5f;
    [SerializeField] private float rotationSpeed = 10f;

    [Header("Push/Pull Settings")]
    [SerializeField] private float interactionRange = 1f;
    [SerializeField] private LayerMask pushableLayer;
    [SerializeField] private float pushForce = 10f;
    [SerializeField] private float pushSpeedMultiplier = 0.5f;

    private bool isGrounded;
    private Rigidbody rb;
    private Transform cameraTransform;
    private Rigidbody pushedObjectRb;
    private bool isPushing = false;
    private Vector3 originalCameraPosition;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        cameraTransform = Camera.main.transform;
    }

    void Update()
    {
        HandlePushPull();
        HandleMovement();
        HandleJump();
        UpdateAnimator();
    }

    private void HandleMovement()
    {
        float horizontalInput = Input.GetAxis("Horizontal");

        Vector3 cameraForward = cameraTransform.forward;
        Vector3 cameraRight = cameraTransform.right;
        rb.position.Set(0, 0, 0);
        cameraForward.y = 0f;
        cameraRight.y = 0f;
        cameraForward.Normalize();
        cameraRight.Normalize();

        Vector3 movement = cameraRight * horizontalInput * moveSpeed * Time.deltaTime;

        if (SceneManager.GetActiveScene().name == "Prototype Scene")
        {
            movement.z = 2.5f * Time.deltaTime;
        }

        // Apply speed multiplier when pushing
        if (isPushing) movement *= pushSpeedMultiplier;

        transform.Translate(movement, Space.World);
        
        // Apply force to pushed object
        if (isPushing && pushedObjectRb != null)
        {
            Vector3 forceDirection = transform.forward * horizontalInput;
            pushedObjectRb.AddForce(forceDirection * pushForce, ForceMode.Force);
        }

        UpdateRotation(horizontalInput);
    }

    private void UpdateRotation(float horizontalInput)
    {
        if (horizontalInput > 0)
        {
            transform.rotation = Quaternion.Euler(0f, -90f, 0f);
        }
        else if (horizontalInput < 0)
        {
            transform.rotation = Quaternion.Euler(0f, 90f, 0f);
        }
    }

    private void HandleJump()
    {
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            isGrounded = false;
        }
    }

    private void HandlePushPull()
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            if (!isPushing)
            {
                TryStartPushing();
            }
            else
            {
                StopPushing();
            }
        }
    }

    private void TryStartPushing()
    {
        RaycastHit hit;
        Vector3 rayOrigin = transform.position + Vector3.up * 0.5f;
        if (Physics.Raycast(rayOrigin, transform.forward, out hit, interactionRange, pushableLayer))
        {
            pushedObjectRb = hit.collider.GetComponent<Rigidbody>();
            if (pushedObjectRb != null)
            {
                isPushing = true;
                moveSpeed *= pushSpeedMultiplier;
            }
        }
    }

    private void StopPushing()
    {
        isPushing = false;
        pushedObjectRb = null;
        moveSpeed /= pushSpeedMultiplier;
    }

    private void UpdateAnimator()
    {
        animator.SetBool("IsJumping", !isGrounded);
        animator.SetBool("IsRunning", Input.GetAxis("Horizontal") != 0 && isGrounded && !isPushing);
        animator.SetBool("IsPushing", isPushing && Input.GetAxis("Horizontal") != 0 && isGrounded);
    }

    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }

    // Visualize interaction range in editor
    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.blue;
        Vector3 rayStart = transform.position + Vector3.up * 0.5f;
        Gizmos.DrawLine(rayStart, rayStart + transform.forward * interactionRange);
    }
}