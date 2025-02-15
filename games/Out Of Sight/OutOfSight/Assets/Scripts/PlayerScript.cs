using UnityEditor.SearchService;
using UnityEngine.SceneManagement;
using UnityEngine;

public class PlayerScript : MonoBehaviour
{
    [SerializeField] private Animator animator;
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 5f; // Force applied for jumping
    [SerializeField] private float rotationSpeed = 10f; // Rotation speed in degrees per second

    private bool isGrounded; // To check if the player is on the ground
    private Rigidbody rb;
    private Transform cameraTransform;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        cameraTransform = Camera.main.transform; // Assuming the main camera is used
    }

    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");

        // Get the camera's forward and right directions
        Vector3 cameraForward = cameraTransform.forward;
        Vector3 cameraRight = cameraTransform.right;

        // Flatten the vectors to ignore any vertical component
        cameraForward.y = 0f;
        cameraRight.y = 0f;

        // Normalize the vectors to ensure consistent movement speed
        cameraForward.Normalize();
        cameraRight.Normalize();

        // Calculate movement direction relative to the camera
        Vector3 movement = (cameraRight * horizontalInput) * moveSpeed * Time.deltaTime;

        if(SceneManager.GetActiveScene().name == "Prototype Scene") {
            movement.z = 2.5f;
        } else {
            movement.z = 0f;
        }

        // Apply the movement in world space
        transform.Translate(movement, Space.World);

        // Snap rotation to match movement direction
        if (horizontalInput > 0) // Moving right
        {
            transform.rotation = Quaternion.Euler(0f, -90f, 0f);
            
        }
        else if (horizontalInput < 0) // Moving left
        {
            transform.rotation = Quaternion.Euler(0f, 90f, 0f);
    
        }
        
        // Handle jumping
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            isGrounded = false;
        }

        // Update animator parameters
        CheckAnimatorParameters(horizontalInput);
    }

   private void CheckAnimatorParameters(float input)
{
    // Handle grounded status for jumping animation
    animator.SetBool("IsJumping", !isGrounded);

    // Handle running animation
    animator.SetBool("IsRunning", input != 0 && isGrounded);
}

    private void OnCollisionEnter(Collision collision)
    {
        // Check if the player has landed on the ground
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }
}
