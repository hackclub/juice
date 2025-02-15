using System.Collections;
using UnityEngine;

public class Trigger: MonoBehaviour
{
    public float hoverForce = 120f;

    void OnTriggerStay(Collider other)
    {
        other.GetComponent<Rigidbody>().AddForce(Vector3.up * hoverForce, ForceMode.Acceleration);
        Debug.Log ("Object is within trigger");
    }
}