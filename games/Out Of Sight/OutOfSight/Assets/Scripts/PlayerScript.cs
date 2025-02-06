using UnityEngine;

public class PlayerScript : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 5f; // Force applied for jumping

    private bool isGrounded; // To check if the player is on the ground
    private Rigidbody rb;

    void Start(){
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        
        float horizontalInput = Input.GetAxis("Horizontal");

        
        Vector3 movement = new Vector3(horizontalInput, 0f, 0f) * moveSpeed * Time.deltaTime;

        
        transform.Translate(movement);

       
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            isGrounded = false;
        }
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

